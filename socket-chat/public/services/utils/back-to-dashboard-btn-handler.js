// back-to-dashboard-btn-handler.js

// Add this function on any page that contains a page-specific back-to-dashboard button
function setUpBackToDashboardButton() {
    const backButton = document.querySelector(".back-to-dashboard-btn");
    if (!backButton) return;

    backButton.addEventListener("click", () => {
        window.location.href = "/dashboard";
    });
}

export { setUpBackToDashboardButton };