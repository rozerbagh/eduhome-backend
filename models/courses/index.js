import mongoose from "mongoose";
const { Schema, model } = mongoose;

const coursesSchema = Schema({
    name: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    difficulty: {
        type: String,
        required: true,
      },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

export const Courses = model('Courses', coursesSchema);
