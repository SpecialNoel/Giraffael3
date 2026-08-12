// room-handler.js

import { getCachedMessages, getCachedMembers } from "./conversation/enter-room-services.js";
import { parseResponse } from "../utils/response-parser.js";
import { createRoom, deleteRoom, joinRoom, leaveRoom } from "./room-api.js";
import { enterRoom } from "./room-navigation.js";
import { renderBasicGui, appendRoomToRoomsContainer, updateRoomCodeInURL } from "./room-view.js";
import { renderMembers } from "./members-services.js";
import { dashboardState } from "../states/dashboard-state.js";
import { renderOlderMessages } from "./conversation/services.js";

// Set up the enter-room logic
async function handleEnterRoom(roomBtn, socket) {
    const roomCode = roomBtn.dataset.roomCode; // dataset.roomCode is dynamically parsed from "data-room-code" attribute in html
    console.log("Clicked enter room:", roomCode);

    // Prevent the user from entering the same room
    if (dashboardState.pendingRoomCode === roomCode) return;

    // Update the pending room code recorded in dashboard states
    dashboardState.pendingRoomCode = roomCode;

    // Modify the url to reflect user entering this room without refreshing the page
    updateRoomCodeInURL(roomCode);

    // Check if there are any cached messages (which were fetched and loaded prior to the user re-entering the room)
    const cachedMessages = getCachedMessages(roomCode);
    if (cachedMessages) {
        // If there are cached messages existed, update the dashboard with information stored inside dashboard state
        const conversationElement = document.getElementById("conversation");
        const membersElement = document.getElementById("members");
        const emptyMessageElement = document.getElementById("emptyMessage");
        const membersHeadingElement = document.getElementById("membersHeading");

        // Empty the current conversation first
        conversationElement.innerHTML = "";

        await renderBasicGui();
        const members = getCachedMembers(roomCode);
        renderMembers(membersElement, emptyMessageElement, membersHeadingElement, members);
        renderOlderMessages(conversationElement, cachedMessages);
        console.log("Rendered cached messages");
        return;
    } else {
        // Otherwise, send request to server to fetch the initial messages, store them into dashboard state, and update the dashboard accordingly
        console.log("No cached messages found");
    }

    // Fire an "enter room" socket event to server
    enterRoom(socket, roomCode);

    // Room info will be retrieved and updated to Dashboard page via socket events
}

// Set up the leave-room logic
async function handleLeaveRoom(leaveBtn, socket, roomRow) {
    const roomCode = leaveBtn.dataset.roomCode;
    console.log("Clicked leave room:", roomCode);

    // Send roomCode to server, then retrieve result contained in response from server
    const result = await parseResponse(await leaveRoom(roomCode));

    if (result.success) {
        // Notify other users in the room via socket event
        socket.emit("leaveRoom", result.data.roomCode);

        // Remove the roomBtn-leaveBtn pair from the rooms container
        roomRow.remove();

        // Redirect the user back to the dashboard
        alert("Successfully left room");
        window.location.href = "/dashboard";
    } else {
        alert("Error in leaving room");
    }
}

// Set up the delete-room logic
async function handleDeleteRoom(deleteBtn, roomRow) {
    const roomCode = deleteBtn.dataset.roomCode;
    console.log("Clicked delete room:", roomCode);

    // Send roomCode to server, then retrieve result contained in response from server
    const result = await parseResponse(await deleteRoom(roomCode));

    if (result.success) {
        // Remove the roomBtn-leaveBtn pair from the rooms container
        roomRow.remove();

        alert("Successfully deleted room");
        window.location.href = "/dashboard";
    } else {
        alert("Error in deleting room");
    }
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
            // then retrieve result contained in response from server
            const result = await parseResponse(await createRoom(roomName));
            
            // Step 2: Emit the "join room" event to server via socket events
            // This step is needed to atomically join the user to the newly created room
            socket.emit("joinRoom", result.data.roomInfo.roomCode);
            
            // Render the rooms container by appending the new room to the list
            const containerDiv = document.getElementById("rooms-container");
            appendRoomToRoomsContainer(containerDiv, result.data.roomInfo, result.data.role);

            // Clear the room name field
            document.querySelector("#roomNameInCreateRoom").value = "";
        } catch (err) {
            // Print error message to client side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");     
            // Clear the room name field 
            document.querySelector("#roomCodeInJoinRoom").value = "";  
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
            // then retrieve result contained in response from server
            const result = await parseResponse(await joinRoom(roomCode));

            // Step 2: Emit the "join room" event to server via socket events
            socket.emit("joinRoom", roomCode);

            // Render the rooms container by appending the new room to the list
            const containerDiv = document.getElementById("rooms-container");
            appendRoomToRoomsContainer(containerDiv, result.data.roomInfo, result.data.role);

            // Clear the room code field
            document.querySelector("#roomCodeInJoinRoom").value = "";
        } catch (err) {
            // Print error message to client side in case something went wrong during this process
            switch (err.code) {
                case "ALREADY_IN_ROOM":
                    alert("You have already joined this room");
                    // Clear the room code field
                    document.querySelector("#roomCodeInJoinRoom").value = "";
                    break;

                default:
                    console.error(err);
                    alert("Something went wrong");
                    // Clear the room code field
                    document.querySelector("#roomCodeInJoinRoom").value = "";
            }   
        }
    };

    // Add the functionality to join button
    joinRoomBtn.addEventListener("click", handleClick);
}

export { handleEnterRoom, 
         handleLeaveRoom, 
         handleDeleteRoom,
         handleCreateRoom,
         handleJoinRoom };