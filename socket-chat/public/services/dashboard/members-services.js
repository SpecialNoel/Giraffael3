// member-list-services.js

// Render the list of current active users in the room on Dashboard page UI
function renderMembers(membersElement, emptyMessageElement, membersHeadingElement, members) {
    // Render the member list container on displaying the empty message or not
    emptyMessageElement.hidden = members.length > 0;
    membersElement.hidden = members.length === 0;

    // Render the member list by appending any user that is currently active
    if (members.length > 0) {
        // Update the header
        membersHeadingElement.textContent = `Members (${members.length})`;

        // Empty the list first
        membersElement.innerHTML = "";

        // For each user that is currently active in the room, add info about the user to the list
        members.forEach(({ userId, username }) => {
            const item = document.createElement("li");
            item.textContent = `[${username}]: ${userId}`;
            membersElement.appendChild(item);
            // Scroll the browser window to the bottom of the members element
            membersElement.scrollTop = membersElement.scrollHeight;
        });
    }
}

export { renderMembers };