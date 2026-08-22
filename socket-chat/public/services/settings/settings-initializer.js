// settings-initializer.js

import { 
    setUpBackToDashboardButton,
    setUpLogoutButton
 } from "../utils/button-handlers.js";

import { 
    setUpUserIdContainer,
    setUpUserEmailContainer,
    setUpUsernameContainer
} from "./info-panel-handler.js";

// Initialize the Settings page by setting up the page for displaying user
// related information, as well as event listeners to handle user requests
function initSettingsPage() {
    // Set up the back-to-dashboard button
    setUpBackToDashboardButton();

    // Set up the logout button
    setUpLogoutButton();

    // Get information panel, which displays user-related information
    const infoPanel = document.querySelector(".info-panel");
    
    // UserId section (immutable)
    const userIdContainer = setUpUserIdContainer();

    // User email section (immutable)
    const userEmailContainer = setUpUserEmailContainer();

    // Username section (mutable)
    const usernameContainer = setUpUsernameContainer();

    // Password section (mutable; unviewable) 

    // Add every section onto the information panel
    infoPanel.appendChild(userIdContainer);
    infoPanel.appendChild(userEmailContainer);
    infoPanel.appendChild(usernameContainer);
}

export { initSettingsPage };