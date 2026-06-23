// membership-services.js

import { Membership } from "../models/membership-model.js";
import { Room } from "../models/room-model.js";

// Add the user to the given room by creating a new membership
async function joinRoom(userObjectId, roomObjectId) {
    try {
        // Check room existence
        const roomExists = await Room.exists({ _id: roomObjectId });
        if (!roomExists) {
            return {
                success: false,
                reason: "Room not found",
                membership: null
            };
        }

        // Create a new membership
        const newMembership = await Membership.create({
            userObjectId,
            roomObjectId
        });
        return {
            success: true,
            membership: newMembership
        };
    } catch (err) {
        // Handle duplicate key error, which is fired by unique index of the Membership schema 
        if (err.code === 11000) {
            return {
                success: false,
                reason: "Already a member of room",
                membership: null
            };
        }
        // Handle other errors
        console.error("Failed to join user to room:", err);
        throw err;
    }
}

// Remove the user from the given room by deleting the existing membership
async function leaveRoom(userObjectId, roomObjectId) {
    try {
        await Membership.deleteOne({
            userObjectId,
            roomObjectId
        });
    } catch (err) {
        console.error("Failed to leave user from room:", err);
        throw err;
    }
}

async function checkMembership(userObjectId, roomObjectId) {
    try {
        const membership = await Membership.findOne({
            userObjectId,
            roomObjectId
        });
        return membership !== null;
    } catch (err) {
        console.error("Failed to check user membership:", err);
        throw err;
    }
}

async function getAllMembersInRoom(roomObjectId) {
    try {
        return await Membership.find({
            roomObjectId
        });
    } catch (err) {
        console.error("Failed to get all members in room:", err);
        throw err;
    }
}

async function getAllRoomsOfUser(userObjectId) {
    try {
        return await Membership.find({
            userObjectId
        });
    } catch (err) {
        console.error("Failed to get all rooms joined by user:", err);
        throw err;
    }
}