// message-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for the "Message" model
const messageSchema = new Schema(
    {
        // room is the Room document where this message was sent to
        room: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        },
        // sender is the User document who sent this message
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // content is what this Message document is about
        content: {
            type: String,
            required: true,
            trim: true // trim removes whitespaces from the beginning and end of the content
        },
        // type specifies what kind of message this Message document is
        type: {
            type: String,
            enum: ["text", "image", "file"],
            default: "text"
        },
        // expiresAt enables message auto-deletion after it lived for a specified amount of time
        // This field is specified during Message document creation
        // e.g.: expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // expires after 24h since creation
        expiresAt: {
            type: Date,
            default: null
        },
    }, 
    { timestamps: true } // Adds the createdAt and the updatedAt fields to each document
);

// Set the message to expire exactly at the time stored in expiresAt
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// The "Message" model
const Message = mongoose.model("Message", messageSchema, "messages");
export default Message;
