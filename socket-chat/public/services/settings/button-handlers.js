// button-handlers.js

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

function setUpUpdateUsernameBtn() {
    const updateUsernameBtn = document.createElement("button");
    updateUsernameBtn.type = "submit";
    updateUsernameBtn.className = "update-username-btn";
    updateUsernameBtn.textContent = "Save";
    return updateUsernameBtn;
}

export { setUpBackToDashboardButton, 
         setUpLogoutButton,
         setUpUpdateUsernameBtn };