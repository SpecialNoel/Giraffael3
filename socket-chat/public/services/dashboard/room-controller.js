// room-controller.js

import { handleEnterRoom, 
         handleLeaveRoom, 
         handleDeleteRoom,
         handleCreateRoom,
         handleJoinRoom } from "./room-handler.js";

// Set up the rooms container
function handleRoomsContainer(socket, conversationCursors) {    
    /*
        On the dashboard page, add functionality to each room icon/button such that
        a certain task will be executed whenever the user clicks on the room icon.
    */
    const containerDiv = document.getElementById("rooms-container");

    // Attach functionalities to each button associated with a room
    const handleClick = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Handle user "enter room" request
            const roomBtn = e.target.closest(".room-btn"); 
            if (roomBtn) {
                await handleEnterRoom(roomBtn, socket, conversationCursors);
                return;
            }

            // Handle user "leave room" request
            const leaveBtn = e.target.closest(".leave-btn"); 
            if (leaveBtn) {
                const roomRow = leaveBtn.closest(".room-row");
                await handleLeaveRoom(leaveBtn, roomRow);
                return;
            }

            // Handle user "delete room" request
            const deleteBtn = e.target.closest(".delete-btn"); 
            if (deleteBtn) {
                const roomRow = deleteBtn.closest(".room-row");
                await handleDeleteRoom(deleteBtn, roomRow);
                return;
            }
        } catch (err) {
            // Print error message to client side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");        
        }
    };

    // Add the functionality to roomContainer
    containerDiv.addEventListener("click", handleClick);
}

// Set up the room logics (via http endpoints, socket events, or both)
function setupRoomEvents(socket, conversationCursors) {
    // Set up the events attached to each room container ("leave room", "delete room")
    handleRoomsContainer(socket, conversationCursors);
    // Set up the "create room" event
    handleCreateRoom(socket);
    // Set up the "join room" event
    handleJoinRoom(socket);
}

export { setupRoomEvents };
