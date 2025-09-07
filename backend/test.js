// test-endpoint.js
import axios from "axios";

// --- Configuration ---
// The URL of your Python/FastAPI service
const pythonApiUrl = "http://localhost:5000/query";

// The message and category you want to test
const testPayload = {
  prompt: "Show me salinity profiles near the equator in March 2023",
  category: "KNOWLEDGE_QUERY", // Change to "knowledge" to test the other path
};

// --- Test Function ---
async function testApiEndpoint() {
  console.log("🚀 Sending request to Python service...");
  console.log("Payload:", testPayload);

  try {
    const {data} = await axios.post(pythonApiUrl, testPayload);
    
    console.log("\n✅ Success! Server responded with:");
    console.log(data.context); // Log the JSON response from the server

  } catch (error) {
    console.error("\n❌ Error! The request failed.");
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("Error: No response received from the server. Is it running?");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error:", error.message);
    }
  }
}

// --- Run the Test ---
testApiEndpoint();