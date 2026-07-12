// delete-room-service.js

import { Room } from "../../../models/room-model.js";
import { Membership } from "../../../models/membership-model.js";

// Delete the given room from the database
async function deleteRoom(roomCode) {
    try {
        // await Room.deleteOne({ roomCode }); // Hard-delete

        // Soft-delete: ”deleted” marked as true, but conversation 
        // still exist, and the room becomes inaccessible to everyone
        const date = new Date();
        const room = await Room.findOneAndUpdate(
            { 
                roomCode: roomCode, 
                deleted: false 
            },
            {
                deleted: true,
                deletedAt: date
            },
            {
                new: true // return the updated room document
            }
        );
        // Handle room does not exist or already been deleted error
        if (!room) {
            return null;
        }

        // Set the "active" status of  all users in the room to false
        await Membership.updateMany(
            {
                roomObjectId: room._id, // find all membership documents that are active and associated with the room
                active: true,
            },
            {
                $set: {
                    active: false, // set the "active" statuses to false
                },
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