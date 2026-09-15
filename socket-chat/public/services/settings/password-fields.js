// password-fields.js

// Retrieve the password fields on change password panel
function getPasswordFields() {
    return [
        {
            input: document.querySelector(".current-password-value"),
            toggler: document.querySelector("#current-password-toggler")
        },
        {
            input: document.querySelector(".new-password-value"),
            toggler: document.querySelector("#new-password-toggler")
        },
        {
            input: document.querySelector(".confirm-new-password-value"),
            toggler: document.querySelector("#confirm-new-password-toggler")
        }
    ];
}

export { getPasswordFields };