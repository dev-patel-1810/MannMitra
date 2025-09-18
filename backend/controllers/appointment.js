import { async_handler } from "../utils/async_handler.js";
import { ApiError } from "../utils/api_error.js";
import { ApiResponse } from "../utils/api_response.js";
import { Appointment } from "../models/appointment.js";
import { counselor_user } from "../models/counselor_user.js";
import { stud_user } from "../models/stud_user.js";

const bookAppointment = async_handler(async (req, res) => {
    const { counsellorId, appointmentDate, startTime, endTime, notes, userId } = req.body;

    // Validate input
    if (!counsellorId || !appointmentDate || !startTime || !endTime || !userId) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if student exists
    const student = await stud_user.findById(userId);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    // Convert date and time to proper format
    const appointmentDateTime = new Date(appointmentDate);
    
    // Check if the appointment time is in the future
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

    // Create appointment
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

const getAppointments = async_handler(async (req, res) => {
    // const userId = req.user._id;
    // const userRole = req.user.role;

    const {userId, userRole}=req.body;

    let appointments;
    if (userRole === 'counsellor') {
        appointments = await Appointment.find({ counsellor: userId })
            .populate('student', 'user_name user_email user_phone')
            .sort({ appointmentDate: 1 });
    } else {
        appointments = await Appointment.find({ student: userId })
            .populate('counsellor', 'counselor_name counselor_email counselor_phone')
            .sort({ appointmentDate: 1 });
    }

    return res.status(200).json(
        new ApiResponse(200, appointments, "Appointments fetched successfully")
    );
});

const updateAppointmentStatus = async_handler(async (req, res) => {
    // Get appointmentId from URL parameters
    const { appointmentId } = req.params;

    // Get the new status from the request body
    const { status, userId } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new ApiError(404, "Appointment not found");
    }

    // Verify that the counsellor is updating their own appointment
    if (appointment.counsellor.toString() !== userId.toString()) {
        throw new ApiError(403, "Unauthorized to update this appointment");
    }

    // Update the status field and save the document
    appointment.status = status;
    await appointment.save();

    return res.status(200).json(
        new ApiResponse(200, appointment, "Appointment status updated successfully")
    );
});

export {
    bookAppointment,
    getAppointments,
    updateAppointmentStatus
};