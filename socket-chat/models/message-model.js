// message-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
    { timestamps: true } // Adds createdAt and updatedAt fields
);

const Message = mongoose.model("Message", messageSchema, "messages");
export default Message;
