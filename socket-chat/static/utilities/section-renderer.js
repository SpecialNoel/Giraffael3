// section-renderer.js

// Display the given section, and hide the other sections
async function showSection(section) {
    if (section === "login") {
        document.getElementById("login-section").style.display = "flex";
        document.getElementById("room-selection-section").style.display = "none";
        document.getElementById("chat-section").style.display = "none";
    } else if (section === "room") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("room-selection-section").style.display = "flex";
        document.getElementById("chat-section").style.display = "none";
    } else if (section === "chat") {
        document.getElementById("login-section").style.display = "none";
        document.getElementById("room-selection-section").style.display = "none";
        document.getElementById("chat-section").style.display = "flex";
    } else {
        console.error(`Invalid section: ${section}`);
    }
}

export default showSection;
