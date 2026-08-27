// settings-initializer.js

import { 
    setUpBackToDashboardButton,
    setUpLogoutButton
} from "./action-handlers.js";

import { 
    fetchAndUpdateUserId,
    fetchAndUpdateUserEmail,
    setUpUsernameContainer,
    setUpPasswordContainer
} from "./info-panel-handler.js";

// Initialize the Settings page by setting up the page for displaying user
// related information, as well as event listeners to handle user requests
async function initSettingsPage() {
    // Set up the back-to-dashboard button
    setUpBackToDashboardButton();

    // Set up the logout button
    setUpLogoutButton();

    // Get information panel, which displays user-related information
    const infoPanel = document.querySelector(".info-panel");
    
    // UserId section (immutable)
    await fetchAndUpdateUserId();

    // User email section (immutable)
    await fetchAndUpdateUserEmail();

    // Username section (mutable)
    await setUpUsernameContainer();

    // Password section (immutable; unviewable) 
    setUpPasswordContainer();

    // Update password section (mutable)

}

export { initSettingsPage };