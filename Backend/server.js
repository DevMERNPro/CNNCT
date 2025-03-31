import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// Proper CORS setup
app.use(
  cors({
    origin: ["https://meeting-project-two.vercel.app", "http://localhost:5173"], // Allow both local & deployed frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Needed if using cookies or auth headers
  })
);

// Connect Database
connectDB();

// Root route (Displays "Server is running" in H1)
app.get("/", (req, res) => {
  res.send("<h1>Server is running</h1>");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/event", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
