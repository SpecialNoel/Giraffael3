// signup-service.js

// Set up the signup form
function signupTraditional() { 
    /*
        On the sign-up page, collect the client's credentials and
        send them to the server for account creation result.

        If the input credentials already exist, prompt the client about this.
        Otherwise, receive the session cookie sent by the server and 
        redirect client to sign-in page.
    */
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
                body: JSON.stringify({ 
                    userEmail: userEmail, 
                    userPassword: userPassword 
                })
            });

            // Return to sign-in page if the inputs are not valid
            if (!response.ok) {
                alert("Invalid Input.");
                return;
            }

            // Otherwise, retrieve anything sent from server
            const data = await response.json()

            // Redirect the user back to the sign-in page
            window.location.href = "/signin";
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        }
    };

    signupForm.addEventListener("submit", handleSubmit);
}

export { signupTraditional };
