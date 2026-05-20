// button-click-setup.js

async function setUpButtonClickWithEnterKey() {    
    const loginBtn = document.getElementById("loginBtn");
    const createRoomBtn = document.getElementById("createRoomBtn");
    const joinRoomBtn = document.getElementById("joinRoomBtn");

    // Click the button upon user hitting the "Enter" key when filling the fields
    document.getElementById("username").addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            loginBtn.click();
        }
    });
    document.getElementById("roomNameInSelection").addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            createRoomBtn.click();
        }
    });
    document.getElementById("roomCodeInSelection").addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            joinRoomBtn.click();
        }
    });
}

export default setUpButtonClickWithEnterKey;
