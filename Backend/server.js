const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const blogRoutes = require("./routes/blogRoutes");
const {
  notFoundHandler,
  errorHandler,
} = require("./middleware/errorMiddleware");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4001", // Vite default port
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: false })); // URL-encoded body parser

// Simple Request Logging Middleware for debugging
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} request to ${req.url}`,
  );
  next();
});

// API Routes
app.use("/api/blogs", blogRoutes);

// Root route (for basic sanity check)
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Blog Manager API" });
});

// Error handling middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Set Port and Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});
