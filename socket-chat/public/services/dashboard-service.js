// dashboard-service.js

// Set up the room list
function handleRoomList() {    
    /*
        On the dashboard page, add functionality to each room icon/button such that
        a certain task will be executed whenever the user clicks on the room icon.
    */
    const roomList = document.querySelector("#room-list");

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
            const response = await fetch("/rooms/join-room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ roomId: roomId, email: email })
            });

            // Retrieve anything sent from server
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

// Set up the whole dashboard page, which consists of many small components
function handleDashboard() {
    handleRoomList()
}

export default handleDashboard;
