import mongoose from "mongoose";
import * as names from "./names";
const Schema = mongoose.Schema;

const coursesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    users: [{ type: Schema.Types.ObjectId, ref: names.users }],
    difficulty: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    timeseries: true,
  }
);
module.exports = mongoose.model(names.courses, coursesSchema);
