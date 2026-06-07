// user-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for the "User" model
const userSchema = new Schema(
    {
        // userId is mainly displayed to users (e.g. searching a particular user); server accesses the user via "_id"
        userId: { // TODO: Revise the usage of userId (public) and user's _id (object id)
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
            type: String,
            required: function() {
                // passwordHash is only required if the user does not sign-in via Google
                return !this.googleId;
            }
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
export { User };
