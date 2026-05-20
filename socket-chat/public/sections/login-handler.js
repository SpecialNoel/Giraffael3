// login-handler.js

// Set up the login button
async function login() {    
    const loginBtn = document.getElementById("loginBtn");

    // Obtain the username inputted by the user
    return new Promise((resolve) => {
        loginBtn.addEventListener("click", () => {
            const username = document.getElementById("username").value.trim();
            resolve({ username: username });
        });
    }, { once: true });
}

export default login;
