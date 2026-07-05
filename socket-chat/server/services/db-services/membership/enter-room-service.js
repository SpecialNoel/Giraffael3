// enter-room-service.js

async function enterRoom(userObjectId, roomCode, role) {
    try {
        // Try to fetch the room from database
        const room = await Room.findOne({
            roomCode,
            deleted: false
        }).select("_id").lean();
        if (!room) {
            return {
                success: false, 
                reason: "ROOM_NOT_FOUND"
            };
        }

        // Try to fetch the associated membership from database
        const membership = await Membership.findOne({
            userObjectId,
            roomObjectId: room._id,
            active: false
        });
        if (!membership) {
            return {
                success: false, 
                reason: "NOT_IN_ROOM"
            };    
        }

        // Update the membership document to leave the user from the room
        membership.active = true;
        await membership.save();
        return {
            success: true
        };
    } catch (err) {
        // Handle duplicate key error, which is fired by unique index of the Membership schema 
        if (err.code === 11000) {
            return {
                success: false,
                reason: "ALREADY_IN_ROOM",
                membership: null
            };
        }
        // Handle other errors
        console.error("Failed to enter user to room:", err);
        throw err;
    }
}

export { enterRoom };