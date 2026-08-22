// info-panel-handler.js

function setUpUserIdContainer() {
    const userIdContainer = document.createElement("div");
    userIdContainer.className = "user-id-container";

    const userIdLabel = document.createElement("label");
    userIdLabel.textContent = "UserId: ";

    const userIdValue = document.createElement("input"); // TODO: fetch user's userId and load it here
    userIdValue.value = "ID 1";
    userIdValue.readOnly = true;

    userIdContainer.appendChild(userIdLabel);
    userIdContainer.appendChild(userIdValue);
    return userIdContainer;
}

function setUpUserEmailContainer() {
    const userEmailContainer = document.createElement("div");
    userEmailContainer.className = "user-email-container";

    const userEmailLabel = document.createElement("label");
    userEmailLabel.textContent = "Email: ";

    const userEmailValue = document.createElement("input"); // TODO: fetch user's email and load it here
    userEmailValue.value = "Email address";
    userEmailValue.readOnly = true;

    userEmailContainer.appendChild(userEmailLabel);
    userEmailContainer.appendChild(userEmailValue);
    return userEmailContainer;
}

function setUpUsernameContainer() {
    const usernameContainer = document.createElement("div");
    usernameContainer.className = "username-container";

    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Username: ";

    const usernameValue = document.createElement("input"); // TODO: fetch user's username and load it here
    usernameValue.value = "Username";
    usernameValue.readOnly = true;

    usernameContainer.appendChild(usernameLabel);
    usernameContainer.appendChild(usernameValue);
    return usernameContainer;
}

function setUpPasswordContainer() {
    
}

export { setUpUserIdContainer, setUpUserEmailContainer, setUpUsernameContainer };