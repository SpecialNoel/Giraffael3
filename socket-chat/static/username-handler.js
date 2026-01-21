// username-handler.js

import { startConnection } from "/static/client.js"

// Users are required to input their username before they can be connected to the server
function handleUsername() {
    const username = document.getElementById("username").value.trim();

    if (username) {
        // Display the chat section, and hide the login section
        document.getElementById("login-section").style.display = "none";
        document.getElementById("chat-section").style.display = "block";
        startConnection(username);
    } else {
        alert("Please input an username");
    }
}

document.getElementById("connectBtn").addEventListener("click", handleUsername);
