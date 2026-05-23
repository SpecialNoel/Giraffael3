// password-comparer.js

import bcrypt from "bcrypt";

function comparePassword(plainPassword, hashedPasswordInDB) {
    return bcrypt.compare(plainPassword, hashedPasswordInDB);
}

export default comparePassword;