// signup-client.js

import { signupTraditional } from "/sections/signup-handler.js";

async function handle_signup() {
    // Handle user sign-up request
    
    const { userEmail, userPassword } = await signupTraditional();

    window.location.href = "/signin";

    console.log(`Sign-up credentials verified. email: ${userEmail}`);
}

handle_signup();
