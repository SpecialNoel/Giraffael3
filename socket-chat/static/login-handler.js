// login-handler.js

import showSection from "/static/section-renderer.js";

// Set up the login button
async function login() {
    showSection("login");
    
    const loginBtn = document.getElementById("loginBtn");

    // Click the button upon user hitting the "Enter" key when filling the username field
    document.getElementById("username").addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            loginBtn.click();
        }
    });

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
