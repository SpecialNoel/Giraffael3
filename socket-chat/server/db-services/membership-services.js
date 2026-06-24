// membership-services.js

import { Membership } from "../models/membership-model.js";
import { Room } from "../models/room-model.js";

// Add the user to the given room by creating a new membership
async function joinRoom(userObjectId, roomObjectId, role) {
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
            roomObjectId,
            role
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
async function leaveRoom(userObjectId, roomCode) {
    try {
        const isCreator = await isCreatorByRoomCode(userObjectId, roomCode);
        if (!isCreator) throw error("A non-creator member tried to delete room");

        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id");

        await Membership.deleteOne({
            userObjectId,
            roomObjectId: room._id
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

async function getMembersInRoom(roomObjectId) {
    try {
        return await Membership.find({
            roomObjectId
        });
    } catch (err) {
        console.error("Failed to get all members in room:", err);
        throw err;
    }
}

async function getRoomsOfUser(userObjectId) {
    try {
        return await Membership.find({
            userObjectId
        });
    } catch (err) {
        console.error("Failed to get all rooms joined by user:", err);
        throw err;
    }
}

// Retrieve necessary information of rooms the user has joined
async function getRoomsInfo(userObjectId) {
    try {
        const memberships = await Membership.find({
            userObjectId
        })
        .populate({
            path: "roomObjectId", // focusing on the room documents
            match: { deleted: false }, // mark soft-deleted rooms as null
            select: "roomName roomCode creator" // get needed room information
        });

        return memberships
            .filter(membership => membership.roomObjectId) // filter out soft-deleted rooms
            .map(membership => ({ // formatting the information as a list of key-value pairs
                roomName: membership.roomObjectId.roomName,
                roomCode: membership.roomObjectId.roomCode,
                creator: membership.roomObjectId.creator,
                role: membership.role
            }));
    } catch (err) {
        console.error("Failed to get information of rooms joined by user:", err);
        throw err;
    }
}

// Determine whether the user is the creator of the room
async function isCreatorByRoomCode(userObjectId, roomCode) {
    try {
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id");
        if (!room) return false;

        return await Membership.exists({
            userObjectId,
            roomObjectId: room._id,
            role: "creator"
        });
    } catch (err) {
        console.error("Failed to check whether user is the creator of the room:", err);
        throw err;
    }
}

export { joinRoom, 
         leaveRoom, 
         checkMembership, 
         getMembersInRoom, 
         getRoomsOfUser,
         getRoomsInfo,
         isCreator };