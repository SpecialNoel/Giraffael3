// credentials-validator.js

async function validateCredentials(credentials) {
    console.log(`Credentials: ${credentials.username}`);
    return credentials.username === "";
}

export default validateCredentials;
