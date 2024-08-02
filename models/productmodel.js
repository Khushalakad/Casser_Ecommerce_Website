import mongoose from "mongoose";
const producySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, contentType: String, required: true },
    image: { data: Buffer,contentType:String },
    category: { type: mongoose.ObjectId, ref: 'category', required: true },
    quantity: { type: Number, required: true },
    slug: { type: String, required: true },
    shipping: { type: Boolean },
  },
  { timestamps: true }
);

export default mongoose.model("Products", producySchema);
