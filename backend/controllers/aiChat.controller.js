import { AIChat } from "../models/chat.model.js";
import { AIMessage } from "../models/message.model.js";

/**
 * Create a new AI chat
 */
export const createAIChat = async (req, res) => {
  const { userId, title } = req.body;

  try {
    const newChat = await AIChat.create({
      user: userId,
      title: title || "New Chat",
    });

    res.status(201).json(newChat);
  } catch (error) {
    res.status(500).json({ message: "Error creating AI chat", error: error.message });
  }
};

/**
 * Get all AI chats for a user
 */
export const getAIChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await AIChat.find({ user: userId }).sort({ updatedAt: -1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching AI chats", error: error.message });
  }
};

/**
 * Send message to AI
 */
export const saveAIMessage = async (req, res) => {
    const { chatId, prompt, response } = req.body;
  
    try {
      // Save user message
      const userMsg = await AIMessage.create({
        chat: chatId,
        sender: "user",
        content: prompt,
      });
  
      // Save AI message
      const aiMsg = await AIMessage.create({
        chat: chatId,
        sender: "ai",
        content: response,
      });
  
      // Update chat with latest AI response
      await AIChat.findByIdAndUpdate(chatId, {
        latestMessage: response,
        updatedAt: Date.now(),
      });
  
      res.status(201).json({
        message: "Messages saved successfully",
        userMessage: userMsg,
        aiMessage: aiMsg,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error saving AI messages",
        error: error.message,
      });
    }
  };

/**
 * Get all messages in an AI chat
 */
export const getAIMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await AIMessage.find({ chat: chatId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching AI messages", error: error.message });
  }
};
