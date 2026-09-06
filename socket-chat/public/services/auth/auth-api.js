// auth-api.js

import { apiFetch } from "../../utils/api.js";

async function signInWithEmailAndPassword(email, plainPassword) {
    return await apiFetch("/signin", {
        method: "POST",
        body: JSON.stringify({ 
            email, 
            plainPassword  
        })
    });
}

async function signUpWithEmailAndPassword(email, plainPassword) {
    return await apiFetch("/signup", {
        method: "POST",
        body: JSON.stringify({ 
            email, 
            plainPassword  
        })
    });
}

export { 
    signInWithEmailAndPassword,
    signUpWithEmailAndPassword
}