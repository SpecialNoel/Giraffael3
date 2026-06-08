// dashboard-service.js

import { appendRoomToRoomsContainer } from "../utils/rooms-container-handler.js";

// Helper function of handleRoomsContainer; set up the functionality of the room button
async function handleRoomBtn(roomBtn) {
    const roomCode = roomBtn.dataset.roomCode; // dataset.roomCode is dynamically parsed from "data-room-code" attribute in html
    console.log("Clicked room:", roomCode);

    const email = localStorage.getItem("email");

    // Send roomCode to server
    const response = await fetch("/rooms/enter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ roomCode: roomCode, email: email })
    });

    // Retrieve response sent from server
    const data = await response.json();

    // Display the error message to the user if the operation fails
    if (!response.ok) {
        alert(data.error);
        return;
    }
    console.log("Current room members:", data.members);
}

// Helper function of handleRoomsContainer; set up the functionality of the leave button
async function handleLeaveBtn(leaveBtn, roomRow) {
    const roomCode = leaveBtn.dataset.roomCode;
    console.log("Clicked leave:", roomCode);

    const userId = localStorage.getItem("_id");

    // Send roomCode to server
    const response = await fetch("/rooms/leave", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ roomCode: roomCode, userId: userId })
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
async function handleDeleteBtn(roomBtn) {
    const roomCode = roomBtn.dataset.roomCode;
    console.log("Clicked room:", roomCode);

    const userId = localStorage.getItem("_id");

    // Send roomCode to server
    const response = await fetch("/rooms/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ roomCode: roomCode, userId: userId })
    });

    // Retrieve response sent from server
    const data = await response.json();

    // Display the error message to the user if the operation fails
    if (!response.ok) {
        alert(data.error);
        return;
    }
    console.log("Response on deleting room: ", data.message);
}

// Set up the rooms container
function handleRoomsContainer() {    
    /*
        On the dashboard page, add functionality to each room icon/button such that
        a certain task will be executed whenever the user clicks on the room icon.
    */
    const roomsContainer = document.querySelector("#rooms-container");

    // Enter the target room upon user clicking on the room icon
    const handleClick = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Get the room button the user clicked on
            const roomBtn = e.target.closest(".room-btn"); 
            if (roomBtn) {
                await handleRoomBtn(roomBtn);
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
                await handleDeleteBtn(deleteBtn);
                return;
            }
        } catch (err) {
            // Print error message to server side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");        
        }
    };

    // Add the functionality to roomContainer
    roomsContainer.addEventListener("click", handleClick);
}

// Set up the create-room logic
function handleCreateRoom() {
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

            // Retrieve user information
            const creatorId = localStorage.getItem("_id");

            // Send roomName to server
            const response = await fetch("/rooms/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ roomName: roomName, creatorId: creatorId })
            });

            // Retrieve response sent from server
            const data = await response.json();

            // Display the error message to the user if the operation fails
            if (!response.ok) {
                alert(data.error);
                return;
            }
            
            // Update the rooms container by appending the new room to the list
            const containerDiv = document.getElementById("rooms-container");
            appendRoomToRoomsContainer(containerDiv, data.roomInfo, true);
        } catch (err) {
            // Print error message to server side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");        
        }
    };

    // Add the functionality to create button
    createRoomBtn.addEventListener("click", handleClick);
}

// Set up the join-room logic
function handleJoinRoom() {
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

            // Retrieve user information
            const userId = localStorage.getItem("_id");

            // Send roomCode to server
            const response = await fetch("/rooms/join", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ roomCode: roomCode, userId: userId })
            });

            // Retrieve response sent from server
            const data = await response.json();

            // Display the error message to the user if the operation fails
            if (!response.ok) {
                alert(data.error);
                return;
            }

            // Update the rooms container by appending the new room to the list
            const containerDiv = document.getElementById("rooms-container");
            // Determine whether the user is the creator of the room
            const isCreatorOfRoom = data.roomInfo.creatorId.toString() === userId.toString();
            appendRoomToRoomsContainer(containerDiv, data.roomInfo, isCreatorOfRoom);
        } catch (err) {
            // Print error message to server side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");        
        }
    };

    // Add the functionality to join button
    joinRoomBtn.addEventListener("click", handleClick);
}

// Set up the whole dashboard page, which consists of many small components
function handleDashboard() {
    handleRoomsContainer();
    handleCreateRoom();
    handleJoinRoom();
}

export { handleDashboard };
