// button-handlers.js

// Add this function on any page that contains a page-specific back-to-dashboard button
function setUpBackToDashboardButton() {
    const backButton = document.querySelector(".back-to-dashboard-btn");
    if (!backButton) return;

    backButton.addEventListener("click", () => {
        window.location.href = "/dashboard";
    });
}

function setUpLogoutButton() {
    const logoutButton = document.querySelector(".logout-btn");
    if (!logoutButton) return;

    logoutButton.addEventListener("click", () => {
        window.location.href = "/signin";
    });
}

export { setUpBackToDashboardButton, setUpLogoutButton };