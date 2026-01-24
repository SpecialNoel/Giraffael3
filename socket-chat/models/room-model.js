// room-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for the "Room" model
// It should have the following attributes:
/* _id, roomCode, roomName, members */
const roomSchema = new Schema({
    roomCode: {
        type: String,
        required: true,
        unique: true
    },
    roomName: {
        type: String,
        required: true
    },
    members: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User"}],
        require: true
    }
    },
    { timestamps: true } // Adds the createdAt and the updatedAt fields
);

// The "Room" model
const Room = mongoose.model("Room", roomSchema, "rooms");
export default Room;
