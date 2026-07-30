import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiError.js" // <-- 1. ADD THIS IMPORT


const app = express();
const allowedOrigins = (process.env.CorsOrigin || "http://localhost:8080,http://localhost:8081,http://localhost:5173,http://127.0.0.1:8080,http://127.0.0.1:8081,http://127.0.0.1:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(null, false);
    },
    credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import adminRouter from "./routes/admin.routes.js"

app.use("/api/v1/users",userRouter);
app.use("/api/v1/admin",adminRouter);


// --- 2. ADD THIS ERROR HANDLER ---
// This MUST be the last piece of middleware before 'export'
// It catches any 'ApiError' thrown from your controllers.
app.use((err, req, res, next) => {
    // Check if the error is an instance of our custom ApiError
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors,
        });
    }

    // For any other types of errors
    console.error("Unhandled Error:", err);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});
// ------------------------------------

export {app};