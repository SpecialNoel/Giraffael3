// room-controller.js

import { parseResponse } from "../utils/response-parser.js";
import { createRoom, deleteRoom, joinRoom, leaveRoom } from "./room-api.js";
import { openRoom } from "./room-navigation.js";
import { appendRoomToRoomsContainer } from "./room-view.js";

// Set up the rooms container
function handleRoomsContainer(socket) {    
    // Set up the enter-room logic
    async function handleEnterRoom(roomBtn, socket) {
        const roomCode = roomBtn.dataset.roomCode; // dataset.roomCode is dynamically parsed from "data-room-code" attribute in html
        console.log("Clicked enter room:", roomCode);

        // Modify the url of user browser, and fire an "enter room" socket event to server
        openRoom(socket, roomCode);
        // Room displaying info will be retrieved and updated to Dashboard page via socket events
    }

    // Set up the leave-room logic
    async function handleLeaveRoom(leaveBtn, roomRow) {
        const roomCode = leaveBtn.dataset.roomCode;
        console.log("Clicked leave room:", roomCode);

        // Send roomCode to server, then retrieve data contained in response from server
        const data = await parseResponse(await leaveRoom(roomCode));

        // Remove the roomBtn-leaveBtn pair from the rooms container
        roomRow.remove();
    }

    // Set up the delete-room logic
    async function handleDeleteRoom(deleteBtn, roomRow) {
        const roomCode = deleteBtn.dataset.roomCode;
        console.log("Clicked delete room:", roomCode);

        // Send roomCode to server, then retrieve data contained in response from server
        const data = await parseResponse(await deleteRoom(roomCode));

        // Remove the roomBtn-leaveBtn pair from the rooms container
        roomRow.remove();
    }

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

            // Step 1: Send room name to server via HTTP endpoints, 
            // then retrieve data contained in response from server
            const data = await parseResponse(await createRoom(roomName));
            
            // Step 2: Emit the "join room" event to server via socket events
            // This step is needed to atomically join the user to the newly created room
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

            // Step 1: Send room code to server via HTTP endpoints,
            // then retrieve data contained in response from server
            const data = await parseResponse(await joinRoom(roomCode));

            // Step 2: Emit the "join room" event to server via socket events
            socket.emit("joinRoom", roomCode);

            // Update the rooms container by appending the new room to the list
            const containerDiv = document.getElementById("rooms-container");
            appendRoomToRoomsContainer(containerDiv, data.roomInfo, data.isCreatorOfRoom);
        } catch (err) {
            // Print error message to client side in case something went wrong during this process
            switch (err.code) {
                case "ALREADY_IN_ROOM":
                    alert("You have already joined this room");
                    break;

                default:
                    console.error(err);
                    alert("Something went wrong");
            }   
        }
    };

    // Add the functionality to join button
    joinRoomBtn.addEventListener("click", handleClick);
}

// Set up the room logics (via http endpoints, socket events, or both)
function setupRoomEvents(socket) {
    // Set up the events attached to each room container ("leave room", "delete room")
    handleRoomsContainer(socket);
    // Set up the "create room" event
    handleCreateRoom(socket);
    // Set up the "join room" event
    handleJoinRoom(socket);
}

export { setupRoomEvents };
