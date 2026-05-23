// password-hasher.js

import bcrypt from "bcrypt";

const saltRound = 10;

function hashPassword(password) {
    return bcrypt.hash(password, saltRound);
}

export default hashPassword;