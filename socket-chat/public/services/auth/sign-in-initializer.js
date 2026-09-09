// sign-in-initializer.js

import { parseResponse } from "../../utils/api.js";
import { signInWithEmailAndPassword } from "./auth-api.js";
import { connectSocket } from "../socket/socket-creator.js";

// Handle user sign-in request by setting up the signin form
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
            const email = document.getElementById("email").value;
            const plainPassword = document.getElementById("plainPassword").value;

            /*
             * Send them to server for validation, then retrieve server response
             * Note that client needs to send information to server at this stage
             * to get the JWT token for later operations
            */
            const result = await parseResponse(await signInWithEmailAndPassword(email, plainPassword));
            
            // If the credentials are invalid, display the error message to the user
            if (!result.success) {
                alert(result.error.message);
                console.log(result.error.code);
                return;
            }

            // Create and connect the socket used for socket communication
            const socket = await connectSocket();
            console.log(`Client side socket ${socket.id} is ready to go.`);

            // User authenticated by server. Proceed to the Dashboard page.
            window.location.href = "/dashboard"; 
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