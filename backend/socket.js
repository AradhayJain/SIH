import { AIChat } from "./models/chat.model.js";
import { AIMessage } from "./models/message.model.js";
import googleGenAi from "./utils/Gemini.js";
import axios from "axios";

function parseDataResponse(responseText) {
  if (typeof responseText !== 'string') {
    return []; // Return empty array if input is not a string
  }
  
  const lines = responseText.split('\n').filter(line => line.trim().startsWith('-'));
  const data = lines.map(line => {
    const obj = {};
    const entries = line.replace('-', '').trim().split(',');
    
    entries.forEach(entry => {
      const [key, value] = entry.split(':').map(s => s.trim());
      // Convert numeric values from string to number
      obj[key] = isNaN(parseFloat(value)) ? value : parseFloat(value);
    });
    
    return obj;
  });
  
  return data;
}


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

                1. **KNOWLEDGE_QUERY**: Use this category if the user is asking for a definition, an explanation, or a general factual question that can be answered from stored documents or general knowledge.
                * Example: "What is a BGC Argo float?"
                * Example: "Explain what salinity is."
                * Example: "Who manages the Argo program?"

                2. **DATA_QUERY**: Use this category if the user is asking for specific, quantifiable data points, trends, comparisons, or visualizations that must be retrieved by querying a structured database.
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

        let knowledgeQueryResponse = null;
        // let dataQueryResponse = null;

        const { data } = await axios.post("http://localhost:5000/query", { prompt:message , category:parsedCategory.category });
        let finalResponse = data || "No data found.";
        console.log(finalResponse)
        if (parsedCategory.category === "DATA_QUERY") {
          // Parse the raw string response into clean JSON
          const parsedData = parseDataResponse(finalResponse.context);
          finalResponse = {...finalResponse, context: parsedData};

        
          console.log("📊 Parsed data for frontend:", parsedData);
        
          // Emit an object with a specific 'type' for the frontend to handle
          io.to(chatId).emit("newMessage", {
            sender: "assistant",
            content: parsedData, // Send the clean array
            type: "DATA_QUERY",    // Add a type so the frontend knows this is for a chart
            chatId,
            timestamp: new Date(),
          });
        }
        else {
          const retrievedContext = finalResponse.context; 
          const userQuestion = message;
      
        
          const professionalPrompt = `
              You are an expert Oceanographic Data Assistant. Your task is to answer the user's question based  on the provided context points Also build up a strong answer based on the context and your knowledge. If the context does not contain the answer, state that the information is not available. Make it point wise.
      
              ## Context:
              ${retrievedContext}
      
              ## User's Question:
              ${userQuestion}
      
              ## Your Answer:
          `;
      
          // Make the final call to the Gemini API
          knowledgeQueryResponse = await googleGenAi(professionalPrompt);
          // const aiMsg = await AIMessage.create({
          //   chat: chatId,
          //   sender: "assistant",
          //   content: knowledgeQueryResponse,
          // });

          // await aiMsg.save();
      
          // // Update chat with latest AI response
          // await AIChat.findByIdAndUpdate(chatId, {
          //   latestMessage: knowledgeQueryResponse,
          //   updatedAt: Date.now(),
          // });

          console.log(knowledgeQueryResponse)
      
          // Emit the final, well-formatted answer
          io.to(chatId).emit("newMessage", {
              sender: "assistant",
              content: knowledgeQueryResponse,
              type: "KNOWLEDGE_QUERY",
              chatId,
              timestamp: new Date(),
          });
      }
        // Send back response
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