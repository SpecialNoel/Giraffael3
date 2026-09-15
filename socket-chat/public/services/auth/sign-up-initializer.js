// sign-up-initializer.js

import { 
    setUpPasswordToggler, 
    setUpPasswordStrengthMeter, 
    setUpPasswordRuleChecker 
} from "./password-helper.js";
import { parseResponse } from "../../utils/api.js";
import { signUpWithEmailAndPassword } from "./auth-api.js";

// Handle user sign-up request by setting up the signup form which authenticates via credentials
function signUp() { 
    /*
        On the sign-up page, collect the user's credentials and
        send them to the server for account creation result.

        If the input credentials already exist, prompt the user about this.
        Otherwise, receive the response sent by the server and 
        redirect user to sign-in page.
    */

    // Enable the password toggler so that user can hide or show their inputted password
    setUpPasswordToggler();
    // Enable estimation on the strength meter of input password
    setUpPasswordStrengthMeter();
    // Enables dynamical password rule update to be displayed to user
    setUpPasswordRuleChecker();

    // Set up the sign-up form
    const signUpForm = document.querySelector("#sign-up-form");
    const handleSubmit = async (e) => {
        // Prevent the page from refreshing
        e.preventDefault();
        
        try {
            // Get user input on email and password field
            const email = document.getElementById("email").value;
            const plainPassword = document.getElementById("plainPassword").value;

            /*
             * Send them to server for validation, then retrieve server response
             * Note that client does not need the JWT token at this stage
             * as they should not connect to the server yet.
            */
            const result = await parseResponse(await signUpWithEmailAndPassword(email, plainPassword));

            // If the sign up failed, display the error message to the user
            if (!result.success) {
                alert(result.error.message);
                console.log(result.error.code);
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

export { signUp };