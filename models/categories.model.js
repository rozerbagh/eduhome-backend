import mongoose from "mongoose";
import * as names from "./names"; 
const Schema = mongoose.Schema;

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subCategories: [{ type: Schema.Types.ObjectId, ref: names.subcategories }],
  },
  {
    timestamps: true,
    timeseries: true,
  }
);
module.exports = mongoose.model(names.categories, categoriesSchema);
