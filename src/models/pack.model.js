import mongoose from "mongoose";

const packSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  type: { type: String, default: "normal" },
  date: { type: Date, required: true },
});

export default mongoose.model("Pack", packSchema);
