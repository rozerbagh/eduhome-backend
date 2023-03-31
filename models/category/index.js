import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categorySchema = Schema({
    name: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

export const Categories = model('Categories', categorySchema);
