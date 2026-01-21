// message-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for the "Message" model
// It should have the following attributes:
/* senderId, username, text, expiredAt */
const messageSchema = new Schema({
    senderId: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        require: true
    },
    text: {
        type: String,
        required: true
    },
    expireAt: {
        type: Date,
        required: true,
        index: { expires: 0 } // Specify this field when creating a new message
    },
    }, 
    { timestamps: true } // Adds the createdAt and the updatedAt fields
);

// The "Message" model
const Message = mongoose.model("Message", messageSchema, "messages");
export default Message;
