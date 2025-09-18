import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stud_user',
        required: true
    },
    counsellor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'counselor_user',
        required: true
    },
    appointmentDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    notes: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const Appointment = mongoose.model('Appointment', appointmentSchema);