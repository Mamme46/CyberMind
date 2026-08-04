const express = require("express");

const authRoutes = require("./routes/auth.routes");
const uploadRoutes = require("./routes/upload.routes");

const app = express();

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

/*
    404
*/
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found."
    });
});
console.log("APP.JS LOADED");
module.exports = app;