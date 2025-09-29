import express from "express";
import path from "path";
import dbConnection  from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();
config({ path: "./config/config.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Serve frontend static files
app.use(express.static(path.join(process.cwd(), "public")));


app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Catch-all: serve index.html for client-side routes
app.get("*", (req, res) => {
  if (req.originalUrl.startsWith("/api/")) {
    return res.status(404).json({ message: "API route not found" });
  }
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

dbConnection();
app.use(errorMiddleware);
export default app;
