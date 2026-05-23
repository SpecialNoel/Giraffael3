// signin-client.js

import signin from "/sections/signin-handler.js";

async function handle_signin() {
    // Handle user sign-in credentials
    
    // Get the verified, valid credentials the client has inputted and sent to server
    const userEmail = await signin();
    localStorage.setItem("user email", userEmail);
    // The credentials are verified by server to be valid, proceed to the Dashboard page.
    window.location.href = "/dashboard";
}

handle_signin();
