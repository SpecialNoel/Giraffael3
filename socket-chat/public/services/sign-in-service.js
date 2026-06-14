// sign-in-service.js

// Set up the signin form
function signIn() {    
    /*
        On the sign-in page, collect the user's credentials and
        send them to the server for verification.

        If credentials are invalid, prompt the user to try again.
        Otherwise, proceed to the next phase with the verified credentials.
    */
    const signInForm = document.querySelector("#sign-in-form");

    const handleSubmit = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Get user input on credentials
            const email = document.getElementById("email").value.trim();
            const plainPassword = document.getElementById("plainPassword").value.trim();

            /*
             * Send them to server for validation
             * Note that client needs to send information to server at this stage
             * to get the JWT token for later operations
            */
            const response = await fetch("/signin", {
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

            // Display the error message to the user if the credentials are invalid
            if (!response.ok) {
                alert(data.error);
                return;
            }

            localStorage.setItem("email", email);        // user email
            localStorage.setItem("userId", data.userId); // userId
            localStorage.setItem("token", data.token);   // JWT token

            // The credentials are verified by server to be valid, proceed to the Dashboard page.
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 50); // 0.05s
        } catch (err) {
            // Print error message to client side in case something went wrong during this process
            console.error(err);
            alert("Something went wrong");        
        }
    };

    // Add the functionality to the sign-in form
    signInForm.addEventListener("submit", handleSubmit);
}

export { signIn };
