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
        // Soft-deletion: room stays in the database after deletion, but users are not allowed interact with it
        deleted: {
            type: Boolean,
            default: false
        },
        // deletedAt is the timestamp that records the time this room is soft-deleted 
        deletedAt: {
            type: Date,
            default: null
        }
    },
    { timestamps: true } // Adds the createdAt and the updatedAt fields to each document
);

// The "Room" model
const Room = mongoose.model("Room", roomSchema, "rooms");
export { Room };
