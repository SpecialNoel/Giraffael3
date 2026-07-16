// member-list-services.js

// Render the list of current active users in the room on Dashboard page UI
function renderMemberList(memberListElement, emptyMessageElement, memberListHeadingElement, memberList) {
    // Render the member list container on displaying the empty message or not
    emptyMessageElement.hidden = memberList.length > 0;
    memberListElement.hidden = memberList.length === 0;

    // Render the member list by appending any user that is currently active
    if (memberList.length > 0) {
        // Update the header
        memberListHeadingElement.textContent = `Members (${memberList.length})`;

        // Empty the list first
        memberListElement.innerHTML = "";

        // For each user that is currently active in the room, add info about the user to the list
        memberList.forEach(({ userId, username }) => {
            const item = document.createElement("li");
            item.textContent = `[${username}]: ${userId}`;
            memberListElement.appendChild(item);
            // Scroll the browser window to the bottom of the memberList element
            memberListElement.scrollTop = memberListElement.scrollHeight;
        });
    }
}

export { renderMemberList };