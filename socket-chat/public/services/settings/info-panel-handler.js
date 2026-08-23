// info-panel-handler.js

// Set up the userId container; userId should be read-only
function setUpUserIdContainer() {
    const userIdContainer = document.createElement("div");
    userIdContainer.className = "user-id-container";

    const userIdLabel = document.createElement("label");
    userIdLabel.textContent = "User ID";

    const userIdValue = document.createElement("span"); // TODO: fetch user's userId and load it here
    userIdValue.className = "user-id-value";
    userIdValue.textContent = "ID 1";

    userIdContainer.appendChild(userIdLabel);
    userIdContainer.appendChild(userIdValue);
    return userIdContainer;
}

// Set up the user email container; user email should be read-only
function setUpUserEmailContainer() {
    const userEmailContainer = document.createElement("div");
    userEmailContainer.className = "user-email-container";

    const userEmailLabel = document.createElement("label");
    userEmailLabel.textContent = "Email";

    const userEmailValue = document.createElement("span"); // TODO: fetch user's email and load it here
    userEmailValue.className = "user-email-value";
    userEmailValue.textContent = "Email address";

    userEmailContainer.appendChild(userEmailLabel);
    userEmailContainer.appendChild(userEmailValue);
    return userEmailContainer;
}

// Set up the username container; username should be editable
function setUpUsernameContainer() {
    const usernameContainer = document.createElement("div");
    usernameContainer.className = "username-container";

    const usernameLabel = document.createElement("label");
    usernameLabel.textContent = "Username";

    const usernameValue = document.createElement("input"); // TODO: fetch user's username and load it here
    usernameValue.className = "username-value";
    usernameValue.value = "Username";

    usernameContainer.appendChild(usernameLabel);
    usernameContainer.appendChild(usernameValue);
    return usernameContainer;
}

// Set up the password container; password should be read-only
function setUpPasswordContainer() {
    const passwordContainer = document.createElement("div");
    passwordContainer.className = "password-container";

    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password";

    const passwordValue = document.createElement("span");
    passwordValue.className = "password-value";
    passwordValue.textContent = "••••••••••••";

    passwordContainer.appendChild(passwordLabel);
    passwordContainer.appendChild(passwordValue);
    return passwordContainer;
}

export { setUpUserIdContainer, 
         setUpUserEmailContainer, 
         setUpUsernameContainer,
         setUpPasswordContainer };