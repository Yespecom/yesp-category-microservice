const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    image: String,
    parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    isActive: { type: Boolean, default: true },
    position: { type: Number, default: 0 },
  },
  { timestamps: true },
)

module.exports = categorySchema
