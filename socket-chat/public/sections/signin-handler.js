// signin-handler.js

// Set up the signin form
async function signin() {    
    return new Promise((resolve, reject) => {
        // Obtain the username inputted by the user
        const signinForm = document.querySelector("#signin-form");
        signinForm.addEventListener("submit", async (e) => {
            // Prevent the page from refreshing
            e.preventDefault();
            
            // Get user input on username field
            const username = document.getElementById("username").value.trim();

            // Send the username to server for validation
            const response = await fetch("/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: username })
            });

            // Return from sign in if the credentials are not valid
            if (!response.ok) {
                console.log("Failed to sign in.");
                return;
            }

            // Otherwise, pass the verified credential to client
            const data = await response.json()
            resolve(data.username);

            // Redirect the client to the dashboard page
            window.location.href = "/dashboard";
        }, { once: true });
    });
}

export default signin;
