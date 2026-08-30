// settings-initializer.js

import { 
    setUpBackToDashboardButton,
    setUpLogoutButton
} from "./action-handlers.js";

import { 
    fetchAndUpdateUserId,
    fetchAndUpdateUserEmail,
    setUpUsernameContainer,
    setUpChangePasswordPanelContainer
} from "./info-panel-handler.js";

// Initialize the Settings page by setting up the page with fetched user
// information, as well as event listeners to handle user requests
async function initSettingsPage() {
    // Set up the back-to-dashboard button
    setUpBackToDashboardButton();
    // Set up the logout button
    setUpLogoutButton();
    // Set up the userId section (immutable)
    await fetchAndUpdateUserId();
    // Set up the user email section (immutable)
    await fetchAndUpdateUserEmail();
    // Set up the username section (mutable)
    await setUpUsernameContainer();
    // Set up the change password panel section (mutable) 
    setUpChangePasswordPanelContainer();
}

export { initSettingsPage };