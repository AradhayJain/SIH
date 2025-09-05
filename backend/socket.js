import googleGenAi from "./utils/Gemini.js";
import axios from "axios";

export default function socketHandler(io) {
  io.on("connection", (socket) => {
    console.log("✅ A user connected:", socket.id);

    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("sendMessage", async ({ chatId, message }) => {
      console.log(`📩 Message in chat ${chatId}:`, message);

      io.to(chatId).emit("newMessage", {
        sender: "user",
        content: message,
        chatId,
        timestamp: new Date(),
      });

      try {
        const categorizationPrompt = `
                You are an expert query classifier for an oceanographic data system. 
                Your task is to categorize the user's prompt into one of two categories: "knowledge" or "data".

                Return your answer in JSON format with two keys: "category" and "reasoning".

                ## Categories:

                1. **knowledge**: Use this category if the user is asking for a definition, an explanation, or a general factual question that can be answered from stored documents or general knowledge.
                * Example: "What is a BGC Argo float?"
                * Example: "Explain what salinity is."
                * Example: "Who manages the Argo program?"

                2. **data**: Use this category if the user is asking for specific, quantifiable data points, trends, comparisons, or visualizations that must be retrieved by querying a structured database.
                * Example: "Show me temperature profiles in the Indian Ocean in May 2024."
                * Example: "Compare the salinity in the Arabian Sea vs. the Bay of Bengal."
                * Example: "What is the trajectory of float 12345?"

                ## User Prompt to Categorize:
                ${message}

                ## Your JSON Response:
                `;
        const categoryResponse = await googleGenAi(categorizationPrompt);
        let parsedCategory;
        try {
        parsedCategory = JSON.parse(categoryResponse);
        } catch {
        parsedCategory = { category: "knowledge", reasoning: "Default fallback if parsing fails." };
        }

        console.log("🤖 Category:", parsedCategory);

        let finalResponse = "";

        if (parsedCategory.category === "data_query") {
          const { data } = await axios.post("http://ml-service/api/query", { message });
          finalResponse = data.answer || "No data found.";
        } else {
          finalResponse = await googleGenAi(message);
        }

        // Send back response
        io.to(chatId).emit("newMessage", {
          sender: "assistant",
          content: finalResponse,
          chatId,
          timestamp: new Date(),
        });
      } catch (error) {
        console.error("❌ Socket error:", error.message);
        io.to(chatId).emit("newMessage", {
          sender: "assistant",
          content: "⚠️ Sorry, I couldn’t process your request.",
          chatId,
          timestamp: new Date(),
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
