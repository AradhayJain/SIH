import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes.js";
import MongoDB from "./database/MongoDb.js";
import ConnectPost from "./database/postGres.js";



const app = express();
const PORT = process.env.PORT || 3000;


const corsOptions = {
  origin: "*", // Replace with your frontend URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

dotenv.config({});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", userRoutes);


app.listen(PORT , () => {
  MongoDB();
  ConnectPost();
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});