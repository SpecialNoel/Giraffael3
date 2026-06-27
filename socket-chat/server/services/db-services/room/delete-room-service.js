// delete-room-service.js

import { Room } from "../../../models/room-model.js"

// Delete the given room from the database
async function deleteRoom(roomCode) {
    try {
        // await Room.deleteOne({ roomCode }); // Hard-delete

        // Soft-delete: ”deleted” marked as true, messages 
        // still exist, and the room becomes inaccessible to everyone
        const date = new Date();
        await Room.findOneAndUpdate(
            { 
                roomCode: roomCode, 
                deleted: false 
            },
            {
                deleted: true,
                deletedAt: date
            }
        );
        console.log("Room deleted from DB\n");
        return date;
    } catch (err) {
        console.error("Failed to delete room:", err);
        throw err;
    }
}

export { deleteRoom };