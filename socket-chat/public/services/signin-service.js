// signin-service.js

// Set up the signin form
function signin() {    
    /*
        On the sign-in page, collect the client's credentials and
        send them to the server for verification.

        If credentials are invalid, prompt the client to try again.
        Otherwise, proceed to the next phase with the verified credentials.
    */
    const signinForm = document.querySelector("#signin-form");

    const handleSubmit = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Get user input
            const email = document.getElementById("email").value.trim();
            const plainPassword = document.getElementById("plainPassword").value.trim();

            // Send the username to server for validation
            const response = await fetch("/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email: email, plainPassword: plainPassword })
            });

            // Return to sign-in page if the credentials are not valid
            if (!response.ok) {
                alert("Invalid credentials.")
                return;
            }

            // Otherwise, retrieve anything sent from server
            const data = await response.json()

            // The credentials are verified by server to be valid, proceed to the Dashboard page.
            window.location.href = "/dashboard";
        } catch (err) {
            console.error(err);
            alert("Something went wrong");        
        }
    };

    signinForm.addEventListener("submit", handleSubmit);
}

export default signin;
