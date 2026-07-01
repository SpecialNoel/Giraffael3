// sign-up-initializer.js

// Handle user sign-up request by setting up the signup form which authenticates via credentials
function signUpTraditional() { 
    /*
        On the sign-up page, collect the user's credentials and
        send them to the server for account creation result.

        If the input credentials already exist, prompt the user about this.
        Otherwise, receive the session cookie sent by the server and 
        redirect user to sign-in page.
    */
    const signUpForm = document.querySelector("#sign-up-form");

    const handleSubmit = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Get user input on email and password field
            const email = document.getElementById("email").value.trim();
            const plainPassword = document.getElementById("plainPassword").value.trim();

            /*
             * Send them to server for validation (without JWT token)
             * Note that client does not need the JWT token at this stage
             * as they should not connect to the server yet.
            */
            const response = await fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ 
                    email, 
                    plainPassword 
                })
            });

            // Retrieve response sent from server
            const data = await response.json();

            // If the sign up failed, display the error message to the user
            if (!response.ok) {
                alert(data.error);
                return;
            }

            // If the sign up succeeded, redirect the user back to the sign-in page
            window.location.href = "/signin";
        } catch (err) {
            // Print error message to client side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");
        }
    };

    // Add the functionality to the sign-up form
    signUpForm.addEventListener("submit", handleSubmit);
}

export { signUpTraditional };