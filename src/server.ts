import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./config";
import bodyParser from "body-parser";
import cors from "cors";
dotenv.config();

const app: Application = express();
const PORT = process.env.port || 3000;
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, world!");
});

import authRoutes from "./routes/user.routes";
import todoRoutes from "./routes/todo.routes";
app.use("/api/auth", authRoutes);
app.use("/api/todo", todoRoutes);
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error connecting server", error);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection failed", err);
  });
