// settings-initializer.js

// Initialize the Settings page by setting up the page for displaying user
// related information, as well as event listeners to handle user requests
function initSettingsPage() {
    // Get information panel, which displays user-related information
    const infoPanel = document.querySelector(".info-panel"); // TODO: make the panel more "panel-like" (e.g. left-panel of Dashboard)
    
    // UserId section (immutable)
    const userIdDiv = document.createElement("div");
    userIdDiv.className = "user-id";
    const userIdText = document.createElement("span");
    userIdText.textContent = "UserId: ";
    const userIdValue = document.createElement("span"); // TODO: fetch user's userId and load it here
    userIdValue.textContent = "ID 1";
    userIdDiv.appendChild(userIdText);
    userIdDiv.appendChild(userIdValue);


    // User email section (immutable) // TODO: fetch user's email and load it here


    // Username section (mutable) // TODO: fetch user's username and load it here


    // Password section (mutable; unviewable) 
    // TODO: dig more into the best design for the password section


    // Add every section onto the information panel
    infoPanel.appendChild(userIdDiv);
}

export { initSettingsPage };