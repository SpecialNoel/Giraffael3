// user-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for the "User" model
// It should have the following attributes: 
// (Note that userId is used here along with _id as only userId can and should be made public)
/* _id, userId, username */
const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    }
    },
    { timestamps: true } // Adds the createdAt and the updatedAt fields
);

// The "User" model
const User = mongoose.model("User", userSchema, "users");
export default User;
