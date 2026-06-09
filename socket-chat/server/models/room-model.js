// room-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for the "Room" model
const roomSchema = new Schema(
    {
        // roomCode is used by users to reference each room (user-only interaction)
        // Server should use the "_id" property of the document/instance when referring to the room
        roomCode: {
            type: String,
            required: true,
            unique: true
        },
        // roomName is mainly displayed to users; server accesses the room via "_id"
        roomName: {
            type: String,
            required: true
        },
        // creatorId refers to the User document that creates this room
        creatorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // members contains a list of User documents
        members: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
            default: []
        },
    },
    { timestamps: true } // Adds the createdAt and the updatedAt fields to each document
);

// The "Room" model
const Room = mongoose.model("Room", roomSchema, "rooms");
export { Room };
