// conn.js

import mongoose from "mongoose";

// Connect to MongoDB 
async function connectToDB() {
    try {
        const connectionString = process.env.MONGODB_URI;
        await mongoose.connect(connectionString);
        console.log("Connected to MongoDB successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
    }
}

export default connectToDB;
