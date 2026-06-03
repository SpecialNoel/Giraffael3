// dashboard-service.js

// Set up the room list
function handleRoomList() {    
    /*
        On the dashboard page, add functionality to each room icon/button such that
        a certain task will be executed whenever the user clicks on the room icon.
    */
    const roomList = document.querySelector("#room-list");

    // Enter the target room upon user clicking on the room icon
    const handleClick = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Get the room button the user clicked on
            const roomBtn = e.target.closest(".room-btn"); 
            if (!roomBtn) return;
            const roomId = roomBtn.dataset.roomId; // dataset.roomId is dynamically parsed from "data-room-id" attribute in html
            console.log("Clicked room:", roomId)

            const email = localStorage.getItem("email");

            // Send roomId to server
            const response = await fetch("/rooms/enter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ roomId: roomId, email: email })
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

    // Add the functionality to roomList
    roomList.addEventListener("click", handleClick);
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
            const data = await response.json()

            // Display the error message to the user if the operation fails
            if (!response.ok) {
                alert(data.error);
                return;
            }
            console.log("roomCode: ", data.roomCode)
            console.log("roomsInfo: ", data.roomsInfo)
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
    handleRoomList();
    handleCreateRoom();
    handleJoinRoom();
}

export default handleDashboard;
