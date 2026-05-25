// password-comparer.js

import bcrypt from "bcrypt";

function comparePassword(plainPassword, passwordHash) {
    return bcrypt.compare(plainPassword, passwordHash);
}

export default comparePassword;