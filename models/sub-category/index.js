import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subCategorySchema = Schema({
    name: {
        type: String,
        required: false
    },
    catgoryId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Categories'
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

export const Subcategories = model('Subcategories', subCategorySchema);
