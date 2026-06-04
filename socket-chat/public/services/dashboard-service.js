// dashboard-service.js

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
            if (!roomBtn) return;
            const roomCode = roomBtn.dataset.roomCode; // dataset.roomCode is dynamically parsed from "data-room-code" attribute in html
            console.log("Clicked room:", roomCode)

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
            const data = await response.json()

            // Display the error message to the user if the operation fails
            if (!response.ok) {
                alert(data.error);
                return;
            }
            console.log("Received response from server:", data.message)
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
    function updateRoomsContainer(newRoomInfo) {
        // Update the rooms container once the room is successfully created
        const containerDiv = document.getElementById("rooms-container");

        const newRoomBtn = document.createElement("button");
        newRoomBtn.className = "room-btn";
        newRoomBtn.dataset.roomCode = newRoomInfo.roomCode;
        newRoomBtn.textContent = newRoomInfo.roomName;

        containerDiv.append(newRoomBtn);
    }

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
            const data = await response.json()

            // Display the error message to the user if the operation fails
            if (!response.ok) {
                alert(data.error);
                return;
            }

            // Update the rooms container by appending the new room to the list
            updateRoomsContainer(data.newRoomInfo);
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

}

// Set up the whole dashboard page, which consists of many small components
function handleDashboard() {
    handleRoomsContainer();
    handleCreateRoom();
    handleJoinRoom();
}

export default handleDashboard;
