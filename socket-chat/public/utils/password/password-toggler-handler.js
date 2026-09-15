// password-toggler-handler.js

// The password input field will be hidden/shown upon user clicking on the password-toggle button
function initializePasswordToggler(passwordInputElement, passwordToggler) {
    passwordToggler.addEventListener("click", () => {
        const isHidden = passwordInputElement.type === "password";
        // "password" --> password is currently hidden
        // "text" --> password is currently shown
        passwordInputElement.type = isHidden ? "text" : "password";
        passwordToggler.textContent = isHidden ? "Hide" : "Show";
    });
}

// Reset the component to hide the password
function resetPasswordToggler(passwordInputElement, passwordToggler) {
    passwordInputElement.type = "password";
    passwordToggler.textContent = "Show";
}

export { 
    initializePasswordToggler,
    resetPasswordToggler
};