const express = require("express");
const authRouter = require("./routes/auth/user");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const app = express();

//----------------registering middleware-------------
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
); 
//frontend communication enabled
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ message: "Backend is running" });
});

// ---------------- Rate Limiter ----------------
const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        console.log(" Rate limiter triggered");
        return res.status(429).json({
            error: "Too many requests, try again later",
        });
    },
});

app.use("/api/auth", (req, res, next) => {
    console.log("Reached /api/auth");
    next();
});
app.use("/api/auth", authLimiter, authRouter);

// ---------------- Central Error Handler ----------------
app.use((err, req, res, next) => {
    console.error(err);

    res.status(err.status || 500).json({
        error:
            process.env.NODE_ENV === "production"
                ? "Something went wrong"
                : err.message,
    });
});

module.exports = app;
