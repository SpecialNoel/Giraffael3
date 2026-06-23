// membership-model.js

import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema for the "Membership" model
const membershipSchema = new Schema(
    {
        // userObjectId refers to the User document of the corresponding user
        userObjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        // roomObjectId refers to the Room document of the corresponding room
        roomObjectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Room",
            required: true
        }
    }
);

// Creates a compound unique index to speed up searching, and ensuring uniqueness of membership
// Duplicated inserts will fail with a duplicate key error
membershipSchema.index(
    { userObjectId: 1, roomObjectId: 1},
    { unique: true }
);

// The "Membership" model
const Membership = mongoose.model("Membership", membershipSchema, "memberships");
export { Membership };
