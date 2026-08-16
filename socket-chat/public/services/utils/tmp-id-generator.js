// tmp-id-generator.js

// Generate a random identifier; 12 characters by default
function generateTemporaryId(idLength=12) {
    // Characters with '1', 'I', '0', 'O' removed to avoid ambiguous characters
    const characters = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let id = "";
    for (let i = 0; i < idLength; i++) {
        id += characters[Math.floor(Math.random() * characters.length)];
    }
    return id;
}

export { generateTemporaryId };