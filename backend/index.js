import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/user.routes.js";
import MongoDB from "./database/MongoDb.js";
import ConnectPost from "./database/postGres.js";
import socketHandler from "./socket.js";
import chatRoutes from "./routes/aiChat.routes.js";

dotenv.config({});

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/user", userRoutes);
app.use("/api/aiChat", chatRoutes);

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Initialize socket handler
socketHandler(io);

server.listen(PORT, () => {
  MongoDB();
  ConnectPost();
  console.log(`🚀 Server running on port ${PORT}`);
});
