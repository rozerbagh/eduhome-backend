import mongoose from "mongoose";
import * as names from "./names";
const Schema = mongoose.Schema;

const subcategoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subCategories: { type: Schema.Types.ObjectId, ref: names.categories },
  },
  {
    timestamps: true,
    timeseries: true,
  }
);
module.exports = mongoose.model(names.subcategories, subcategoriesSchema);
