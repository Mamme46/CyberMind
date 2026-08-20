const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");
const logRoutes = require("./routes/log.routes");
const alertRoutes = require("./routes/alert.routes");
const investigationRoutes = require("./routes/investigation.routes");
const aiRoutes = require("./routes/ai.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const aiConversationRoutes =
require("./routes/aiConversation.routes");
const reportsRoutes = require("./routes/report.routes");
const securityRoutes =
    require("./routes/security.routes");
const app = express();

app.use(
    cors({
        origin: [
            "http://localhost:5173", // Frontend React (Vite)
            "http://127.0.0.1:5173"
        ],
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ],
        credentials: true
    })
);
/*
    Middlewares
*/
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

/*
    Routes
*/
app.get("/", (req, res) => {

    console.log("GET / called");
    res.json({
        success: true,
        message: "Welcome to CyberMind API"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/investigations", investigationRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(
    "/api/ai/conversations",
    aiConversationRoutes
);
app.use("/api/reports", reportsRoutes);
app.use("/api/security", securityRoutes);
/*
    404
*/
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});

module.exports = app;