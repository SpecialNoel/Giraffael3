// back-to-dashboard-btn-handler.js

// Set up the event listener for the back-to-dashboard button
function setUpBackBtn() {
    // Get the back button html element
    const backToDashboardButton = document.querySelector(".back-btn");

    // Redirect the user back to the Dashboard page upon clicking
    backToDashboardButton.addEventListener("click", () => {
        window.location.href = "/dashboard";
    });

    // Hide the button from user's dashboard by default
    backToDashboardButton.style.display = "none";
}

// Enables the back-to-dashboard button upon user entering a room 
function enableBackBtn() {
    // Get the back button html element
    const backToDashboardButton = document.querySelector(".back-btn");
    // Render the button on user's dashboard
    backToDashboardButton.style.display = "block";
}

// Disables the back-to-dashboard button upon user leaving a room 
function disableBackBtn() {
    // Get the back button html element
    const backToDashboardButton = document.querySelector(".back-btn");
    // Hide the button from user's dashboard
    backToDashboardButton.style.display = "none";
}

export { setUpBackBtn, enableBackBtn, disableBackBtn }