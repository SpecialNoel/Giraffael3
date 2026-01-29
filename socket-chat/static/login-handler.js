// login-handler.js

import showSection from "/static/section-renderer.js";

// Set up the login button
async function login() {
    showSection("login");
    
    const loginBtn = document.getElementById("loginBtn");

    // Obtain the username inputted by the user
    return new Promise((resolve) => {
        loginBtn.addEventListener("click", () => {
            const username = document.getElementById("username").value.trim();
            if (!username) return;
            resolve({ username });
        });
    }, { once: true });
}

export default login
