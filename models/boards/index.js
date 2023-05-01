import mongoose from "mongoose";
const { Schema, model } = mongoose;

const boardsSchema = Schema(
  {
    name: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Boards = model("Boards", boardsSchema);
