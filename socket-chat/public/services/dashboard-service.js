// dashboard-service.js

// Set up the room list
function handleRoomList() {    
    /*

    */
    const roomList = document.querySelector("#room-list");

    const handleClick = (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Get user input on credentials
            const roomBtn = e.target.closest(".room-btn"); 
            if (!roomBtn) return;
            const roomId = roomBtn.dataset.roomId; // dataset.roomId is dynamically parsed from "data-room-id" attribute in html
            console.log("Clicked room:", roomId)
        } catch (err) {
            // Print error message to server side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");        
        }
    };

    // Add the functionality to roomList
    roomList.addEventListener("click", handleClick);
}

function handleDashboard() {
    handleRoomList()
}

export default handleDashboard;
