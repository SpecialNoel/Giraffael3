// conn.js

import mongoose from "mongoose";
import "./environment-loader.js";

// Connect to MongoDB
export async function connectToDB() {
    const databasePassword = process.env.DATABASE_PASSWORD;
    const connectionString = `mongodb+srv://jianminglin2893:${databasePassword}` +
        "@cluster0.wu2ivo7.mongodb.net/Giraffael3DB?" +
        "retryWrites=true&w=majority&tls=true";
    await mongoose.connect(connectionString)
        .then(() => console.log("Connected to MongoDB successfully"))
        .catch(err => console.error("MongoDB connection error", err));
}
