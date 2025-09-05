import mongoose from "mongoose";

// AI Chat Schema
const aiChatSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // chat always belongs to a user
    },
    title: {
      type: String,
      default: "New Chat",
    },
    latestMessage: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });
  

export const AIChat = mongoose.model("AIChat", aiChatSchema);