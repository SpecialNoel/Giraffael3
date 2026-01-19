// username-handler.js

import { startConnection } from "/static/client.js"

function handleUsername() {
    const username = document.getElementById("username").value.trim();

    if (username) {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("chat-section").style.display = "block";
        startConnection(username);
    } else {
        alert("Please input an username");
    }
}

document.getElementById("connectBtn").addEventListener('click', handleUsername);
