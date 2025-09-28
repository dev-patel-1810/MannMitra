import { async_handler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { Appointment } from "../models/appointment.js";
import { counselor_user } from "../models/counselor_user.js";
import { stud_user } from "../models/stud_user.js";

const bookAppointment = async_handler(async (req, res) => {
    const { counsellorId, appointmentDate, startTime, endTime, notes, userId } = req.body;

    if (!counsellorId || !appointmentDate || !startTime || !endTime || !userId) {
        throw new ApiError(400, "All fields are required");
    }

    const student = await stud_user.findById(userId);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    
    // Check if student has taken the test
    // More robust check that handles both array and object formats
    if(!student.user_tests || 
       (Array.isArray(student.user_tests) && student.user_tests.length === 0) ||
       (typeof student.user_tests === 'object' && Object.keys(student.user_tests).length === 0)) {
        throw new ApiError(400, "Please take the test before booking an appointment");
    }
    
    const appointmentDateTime = new Date(appointmentDate);

    if (appointmentDateTime < new Date()) {
        throw new ApiError(400, "Cannot book appointment for past date/time");
    }

    // Check if counsellor is available at this time
    const existingAppointment = await Appointment.findOne({
        counsellor: counsellorId,
        appointmentDate: appointmentDateTime,
        $or: [
            {
                startTime: { $lte: startTime },
                endTime: { $gt: startTime }
            },
            {
                startTime: { $lt: endTime },
                endTime: { $gte: endTime }
            }
        ],
        status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
        throw new ApiError(400, "Counsellor is not available at this time");
    }

    const appointment = await Appointment.create({
        student: userId,
        counsellor: counsellorId,
        appointmentDate,
        startTime,
        endTime,
        notes,
        status: 'pending'
    });

    return res.status(201).json(
        new ApiResponse(201, appointment, "Appointment booked successfully")
    );
});

const updateAppointmentStatus = async_handler(async (req, res) => {
    const { appointmentId } = req.params;

    const { status, userId } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    if (appointment.counsellor.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to update this appointment");
    }

    appointment.status = status;
    await appointment.save();

    return res.status(200).json(
        new ApiResponse(200, appointment, "Appointment status updated successfully")
    );
});

export {
    bookAppointment,
    updateAppointmentStatus
};