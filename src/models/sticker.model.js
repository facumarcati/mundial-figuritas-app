import mongoose from "mongoose";

const stickerSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["missing", "owned", "duplicate"],
      default: "missing",
    },
  },
  {
    timestamps: true,
  },
);

const Sticker = mongoose.model("Sticker", stickerSchema);

export default Sticker;
