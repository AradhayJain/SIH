import express from "express";
import {
  createAIChat,
  getAIChats,
  saveAIMessage,
  getAIMessages,
} from "../controllers/aiChat.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect,createAIChat);              // create new AI chat
router.get("/:userId", protect,getAIChats);          // fetch all AI chats for user
router.post("/message",protect, saveAIMessage);      // send message to AI
router.get("/messages/:chatId",protect, getAIMessages); // get messages in AI chat

export default router;
