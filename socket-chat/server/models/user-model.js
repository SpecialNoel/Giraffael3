// user-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for the "User" model
const userSchema = new Schema(
    {
        // userId is mainly displayed to users (e.g. searching a particular user); server accesses the user via "_id"
        userId: {
            type: String,
            required: true,
            unique: true
        },
        // username is mainly used by users to differentiate each other
        username: {
            type: String,
            sparse: true // set sparse to true to allow User documents with no value on this property
        },
        // email is used by server as a way for user authentication
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        // passwordHash is invisible to users; it is used in authentication steps
        passwordHash: {
            type: String
        },
        // googleId is used for user authentication via Google Login
        googleId: {
            type: String,
            sparse: true,
            unique: true
        }
    },
    { timestamps: true } // Adds the createdAt and the updatedAt fields to each document
);

// The "User" model
const User = mongoose.model("User", userSchema, "users");
export default User;
