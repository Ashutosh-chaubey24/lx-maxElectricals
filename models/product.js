const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String, // path to uploaded image
  category: String,
  material: String,
  finishing: String,
  color: String,
  // size: String,
  height: String,
  
  warranty: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema);
