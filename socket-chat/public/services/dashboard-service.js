// dashboard-service.js

import { appendRoomToRoomsContainer } from "../utils/rooms-container-handler.js";
import { apiFetch } from "../utils/api-fetcher.js";
import { enterRoom, enterRoomFromURL } from "./room-service.js";

// Helper function of handleRoomsContainer; set up the functionality of the room button
async function handleRoomBtn(roomBtn, socket) {
    const roomCode = roomBtn.dataset.roomCode; // dataset.roomCode is dynamically parsed from "data-room-code" attribute in html
    console.log("Clicked room:", roomCode);

    const email = localStorage.getItem("email");

    // Send roomCode to server
    const response = await apiFetch("/rooms/enter", {
        method: "POST",
        body: JSON.stringify({ 
            roomCode 
        })
    });

    // Retrieve response sent from server
    const data = await response.json();

    // Display the error message to the user if the operation fails
    if (!response.ok) {
        alert(data.error);
        return;
    }

    // Modify the url to reflect user entering this room without refreshing the page
    history.pushState({}, "", `/dashboard?room=${roomCode}`); // TODO: think of cases where this url needs to be reverted back to the default "/dashboard"

    // Send an "enter room" request to server via socket events
    enterRoom(socket, roomCode);
}

// Helper function of handleRoomsContainer; set up the functionality of the leave button
async function handleLeaveBtn(leaveBtn, roomRow) {
    const roomCode = leaveBtn.dataset.roomCode;
    console.log("Clicked leave:", roomCode);

    // Send roomCode to server
    const response = await apiFetch("/rooms/leave", {
        method: "POST",
        body: JSON.stringify({ 
            roomCode 
        })
    });

    // Retrieve response sent from server
    const data = await response.json();

    // Display the error message to the user if the operation fails
    if (!response.ok) {
        alert(data.error);
        return;
    }

    // Remove the roomBtn-leaveBtn pair from the rooms container
    roomRow.remove();
}

// Helper function of handleRoomsContainer; set up the functionality of the delete button
async function handleDeleteBtn(deleteBtn, roomRow) {
    const roomCode = deleteBtn.dataset.roomCode;
    console.log("Clicked delete:", roomCode);

    // Send roomCode to server
    const response = await apiFetch("/rooms/delete", {
        method: "POST",
        body: JSON.stringify({ 
            roomCode 
        })
    });

    // Retrieve response sent from server
    const data = await response.json();

    // Display the error message to the user if the operation fails
    if (!response.ok) {
        alert(data.error);
        return;
    }

    // Remove the roomBtn-leaveBtn pair from the rooms container
    console.log(`Room ${roomCode} deleted at ${data.deletedAt}`);
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
            // Get the room button the user clicked on
            const roomBtn = e.target.closest(".room-btn"); 
            if (roomBtn) {
                await handleRoomBtn(roomBtn, socket);
                return;
            }

            // Get the leave button the user clicked on
            const leaveBtn = e.target.closest(".leave-btn"); 
            if (leaveBtn) {
                const roomRow = leaveBtn.closest(".room-row");
                await handleLeaveBtn(leaveBtn, roomRow);
                return;
            }

            // Get the delete button the user clicked on
            const deleteBtn = e.target.closest(".delete-btn"); 
            if (deleteBtn) {
                const roomRow = deleteBtn.closest(".room-row");
                await handleDeleteBtn(deleteBtn, roomRow);
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

            // Send roomName to server
            const response = await apiFetch("/rooms/create", {
                method: "POST",
                body: JSON.stringify({ 
                    roomName 
                })
            });

            // Retrieve response sent from server
            const data = await response.json();

            // Display the error message to the user if the operation fails
            if (!response.ok) {
                alert(data.error);
                return;
            }

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

            /* 
             * Send roomCode to server
             * Note that even though the field is called "Authorization",
             *   its functionality is to send the token to server to authenticate
             *   this identity.
            */
            const response = await apiFetch("/rooms/join", {
                method: "POST",
                body: JSON.stringify({ 
                    roomCode 
                })
            });

            // Retrieve response sent from server
            const data = await response.json();

            // Display the error message to the user if the operation fails
            if (!response.ok) {
                alert(data.error);
                return;
            }

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

function handleUserNavigation(socket) {
    window.addEventListener("popstate", () => {
        enterRoomFromURL(socket);
    });
}

// Set up the whole dashboard page, which consists of many small components
function handleDashboard(socket) {
    handleRoomsContainer(socket);
    handleCreateRoom(socket);
    handleJoinRoom(socket);
    handleUserNavigation(socket);
}

function setupRoomsContainerRefresher() {
    // Retrieve room info for rooms container, upon user refreshing the dashboard page
    const loadRooms = async () => {
        // Retrieve info about all rooms the user has joined from server
        const response = await apiFetch("/rooms", {
            method: "GET"
        });

        const data = await response.json();
        const roomsInfo = data.roomsInfo;
        const userId = localStorage.getItem("userId");
        
        // Append each room as a room button to rooms container
        const containerDiv = document.getElementById("rooms-container");
        roomsInfo.forEach(roomInfo => {
            // Determine whether the user is the creator of the room
            const isCreatorOfRoom = roomInfo.creatorId.userId === userId;
            appendRoomToRoomsContainer(containerDiv, roomInfo, isCreatorOfRoom);
        });
    };

    loadRooms();
}

export { handleDashboard, setupRoomsContainerRefresher };
