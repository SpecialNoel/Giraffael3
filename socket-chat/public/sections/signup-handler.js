// signup-handler.js

// Set up the signup form
async function signupTraditional() { 
    /*
        On the sign-up page, collect the client's credentials and
        send them to the server for account creation result.

        If the input credentials already exist, prompt the client about this.
        Otherwise, receive the session cookie sent by the server and 
        redirect client to sign-in page.
    */
    return new Promise((resolve, reject) => {
        const signupForm = document.querySelector("#signup-form");

        const handleSubmit = async (e) => {
            // Prevent the page from refreshing
            e.preventDefault();
            
            try {
                // Get user input on email and password field
                const userEmail = document.getElementById("userEmail").value.trim();
                const userPassword = document.getElementById("userPassword").value.trim();

                // Send the input to server for validation
                const response = await fetch("/signup", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ userEmail: userEmail, userPassword: userPassword })
                });

                // Return to sign-in page if the inputs are not valid
                if (!response.ok) {
                    alert("Invalid Input.")
                    return;
                }

                // Otherwise, pass the verified, valid inputs back to client
                const data = await response.json()
                resolve({ userEmail: data.userEmail });
            } catch (err) {
                reject(err);
            }
        };

        signupForm.addEventListener("submit", handleSubmit);
    });
}

export { signupTraditional };
