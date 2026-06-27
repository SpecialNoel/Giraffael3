// room-controller.js

import { createRoom, deleteRoom, joinRoom, leaveRoom } from "./room-api.js";
import { updateBasicGui, appendRoomToRoomsContainer } from "./room-view.js";
import { navigateToRoom } from "./room-navigation.js";

// Helper function that retrieves data from server response
async function parseResponse(response) {
    // Convert retrieved response received from server to json
    const data = await response.json();

    // Display the error message to the user if the operation fails
    if (!response.ok) throw new Error(data.error);

    return data;
}
   
// Set up the enter-room logic
async function handleEnterRoom(roomBtn, socket) {
    const roomCode = roomBtn.dataset.roomCode; // dataset.roomCode is dynamically parsed from "data-room-code" attribute in html
    console.log("Clicked enter room:", roomCode);

    // Modify the url of user browser, and fire an "enter room" socket event to server
    navigateToRoom(socket, roomCode);

    // Update the main panel upon enter room success
    updateBasicGui();
}

// Set up the leave-room logic
async function handleLeaveRoom(leaveBtn, roomRow) {
    const roomCode = leaveBtn.dataset.roomCode;
    console.log("Clicked leave room:", roomCode);

    // Send roomCode to server, then retrieve response from server
    const data = await parseResponse(await leaveRoom(roomCode));

    // Remove the roomBtn-leaveBtn pair from the rooms container
    roomRow.remove();
}

// Set up the delete-room logic
async function handleDeleteRoom(deleteBtn, roomRow) {
    const roomCode = deleteBtn.dataset.roomCode;
    console.log("Clicked delete room:", roomCode);

    // Send roomCode to server, then retrieve response from server
    const data = await parseResponse(await deleteRoom(roomCode));

    // Remove the roomBtn-leaveBtn pair from the rooms container
    roomRow.remove();
}

// Set up the rooms container
function handleRoomsContainer(socket) {    
    /*
        On the dashboard page, add functionality to each room icon/button such that
        a certain task will be executed whenever the user clicks on the room icon.
    */
    const roomsContainer = document.querySelector("#rooms-container");

    // Attach functionalities to each button associated with a room
    const handleClick = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Handle user "enter room" request
            const roomBtn = e.target.closest(".room-btn"); 
            if (roomBtn) {
                await handleEnterRoom(roomBtn, socket);
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
    roomsContainer.addEventListener("click", handleClick);
}

// Set up the create-room logic
function handleCreateRoom(socket) {
    /*
        On the dashboard page, add functionality to the create room button such that
        user will submit the inputted room name to server to create a room upon clicking the button.
    */
    const createRoomBtn = document.querySelector(".create-btn");

    const handleClick = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Retrieve inputted room name
            const roomName = document.querySelector("#roomNameInCreateRoom").value;
            if (!roomName) {
                alert("Please enter a room name");
                return;
            }

            // Send roomName to server, then retrieve response from server
            const data = await parseResponse(await createRoom(roomName));
            
            /*
             * Emit the join room event to server via socket as well
             * This is necessary as the http request above only updates the database,
             *   which does not make real-time subscription to the room.
            */
            socket.emit("joinRoom", data.roomInfo.roomCode);
            
            // Update the rooms container by appending the new room to the list
            const containerDiv = document.getElementById("rooms-container");
            appendRoomToRoomsContainer(containerDiv, data.roomInfo, true);
        } catch (err) {
            // Print error message to client side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");        
        }
    };

    // Add the functionality to create button
    createRoomBtn.addEventListener("click", handleClick);
}

// Set up the join-room logic
function handleJoinRoom(socket) {
    /*
        On the dashboard page, add functionality to the join room button such that
        user will submit the inputted room code to server to join a room upon clicking the button.
    */
    const joinRoomBtn = document.querySelector(".join-btn");

    const handleClick = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Retrieve inputted room code
            const roomCode = document.querySelector("#roomCodeInJoinRoom").value;
            if (!roomCode) {
                alert("Please enter the room code");
                return;
            }

            // Send roomCode to server, then retrieve response from server
            const data = await parseResponse(await joinRoom(roomCode));

            /*
             * Emit the join room event to server via socket as well
             * This is necessary as the http request above only updates the database,
             *   which does not make real-time subscription to the room.
            */
            socket.emit("joinRoom", roomCode);

            // Update the rooms container by appending the new room to the list
            const containerDiv = document.getElementById("rooms-container");
            appendRoomToRoomsContainer(containerDiv, data.roomInfo, data.isCreatorOfRoom);
        } catch (err) {
            // Print error message to client side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");        
        }
    };

    // Add the functionality to join button
    joinRoomBtn.addEventListener("click", handleClick);
}

// Set up the room logics (via http endpoints, socket events, or both)
function setupRoomEvents(socket) {
    handleRoomsContainer(socket);
    handleCreateRoom(socket);
    handleJoinRoom(socket);
}

export { setupRoomEvents };
