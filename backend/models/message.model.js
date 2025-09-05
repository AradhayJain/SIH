
import mongoose from "mongoose";

const aiMessageSchema = new mongoose.Schema({
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIChat",
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "assistant"], // Who sent it
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  });
  
  export const AIMessage = mongoose.model("AIMessage", aiMessageSchema);