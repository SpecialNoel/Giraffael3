// button-creators.js

function createUpdateUsernameBtn() {
    const updateUsernameBtn = document.createElement("button");
    updateUsernameBtn.type = "submit";
    updateUsernameBtn.className = "update-username-btn";
    updateUsernameBtn.textContent = "Save";
    return updateUsernameBtn;
}

function createOpenPasswordUpdatePanelBtn() {
    const openPasswordUpdatePanelBtn = document.createElement("button");
    openPasswordUpdatePanelBtn.type = "button";
    openPasswordUpdatePanelBtn.className = "open-password-update-panel-btn";
    openPasswordUpdatePanelBtn.textContent = "Edit Password";
    return openPasswordUpdatePanelBtn;
}

export { 
    createUpdateUsernameBtn,
    createOpenPasswordUpdatePanelBtn 
};