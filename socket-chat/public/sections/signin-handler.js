// signin-handler.js

// Set up the signin form
async function signin() {    
    /*
        On the sign-in page, collect the client's credentials and
        send them to the server for verification.

        If credentials are invalid, prompt the client to try again.
        Otherwise, proceed to the next phase with the verified credentials.
    */
    return new Promise((resolve, reject) => {
        const signinForm = document.querySelector("#signin-form");

        const handleSubmit = async (e) => {
            // Prevent the page from refreshing
            e.preventDefault();
            
            try {
                // Get user input
                const userEmail = document.getElementById("userEmail").value.trim();
                const userPassword = document.getElementById("userPassword").value.trim();

                // Send the username to server for validation
                const response = await fetch("/signin", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userEmail: userEmail, userPassword: userPassword })
                });

                // Return to sign-in page if the credentials are not valid
                if (!response.ok) {
                    alert("Invalid credentials.")
                    // Remove the event listener to avoid duplicated submissions on sign-in event 
                    signinForm.removeEventListener("submit", handleSubmit);
                    return;
                }

                // Otherwise, pass the verified, valid credentials back to client
                const data = await response.json()

                // Remove the event listener to avoid duplicated submissions on sign-in event 
                signinForm.removeEventListener("submit", handleSubmit);

                resolve({ userEmail: data.userEmail });
            } catch (err) {
                reject(err);
            }
        };

        signinForm.addEventListener("submit", handleSubmit);
    });
}

export default signin;
