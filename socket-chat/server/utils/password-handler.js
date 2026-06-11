// password-handler.js

import bcrypt from "bcrypt";

const saltRound = 10;

function hashPassword(password) {
    return bcrypt.hash(password, saltRound);
}

function comparePassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
}

export { hashPassword, comparePassword };