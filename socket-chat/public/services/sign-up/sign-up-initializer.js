// sign-up-initializer.js

// Set up the signup form
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

            // Send the input to server for validation
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

            // Display the error message to the user if the sign up failed
            if (!response.ok) {
                alert(data.error);
                return;
            }

            // Otherwise, redirect the user back to the sign-in page
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
