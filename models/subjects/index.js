import mongoose from "mongoose";
const { Schema, model } = mongoose;

const subjectsSchema = Schema(
  {
    name: {
      type: String,
      required: false,
    },
    boardId: {
      type: mongoose.Schema.ObjectId,
      ref: "Boards",
    },
  },
  {
    timestamps: true,
  }
);

export const Subjects = model("Subjects", subjectsSchema);
