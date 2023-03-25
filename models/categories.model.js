import mongoose from "mongoose";
const Schema = mongoose.Schema;

const categoriesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    subCategories: [{ type: Schema.Types.ObjectId, ref: "subcategories" }],
  },
  {
    timestamps: true,
    timeseries: true,
  }
);
module.exports = mongoose.model("categories", categoriesSchema);
