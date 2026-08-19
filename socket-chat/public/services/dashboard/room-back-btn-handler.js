// room-back-btn-handler.js

// Set up the event listener for the room-back button
function setUpRoomBackBtn() {
    // Get the back button html element
    const backButton = document.querySelector(".room-back-btn");
    if (!backButton) return;

    // Redirect the user back to the Dashboard page (while they are inside a room) upon clicking
    backButton.addEventListener("click", () => {
        window.location.href = "/dashboard";
    });

    // Hide the button from user's dashboard by default
    backButton.style.display = "none";
}

// Enables the room-back button upon user entering a room 
function enableRoomBackBtn() {
    // Get the back button html element
    const backButton = document.querySelector(".room-back-btn");
    // Render the button on user's dashboard
    backButton.style.display = "block";
}

// Disables the room-back button upon user leaving a room 
function disableRoomBackBtn() {
    // Get the back button html element
    const backButton = document.querySelector(".room-back-btn");
    // Hide the button from user's dashboard
    backButton.style.display = "none";
}

export { setUpRoomBackBtn, enableRoomBackBtn, disableRoomBackBtn }