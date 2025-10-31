// src/services/log.js

const USER_KEY = "demo_users";

function sleep(ms = 800) {
    return new Promise(res => setTimeout(res, ms));
}

function readUsers() {
    return JSON.parse(localStorage,getItem(USER_KEY) || "[]");
}

function writeUsers(users) {
    localStorage.setItem(USER_KEY, JSON.stringify(users));
}

export async function register (email, password, fullName) {
    
    await sleep();
    const users = readUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

    if(exists){
        const e = new Error("Un compte existe déjà avec cet Email. ");
        e.code = "EMAIL_TAKEN";
        throw e;
    }

    const user = {id: crypto.randomUUID(), email, fullName, passwordHash: btoa(password)};
    users.push(user);
    writeUsers(users);

    return{id: user.id, email: user.email, fullName: user.fullName, token: crypto.randomUUID()};

}

export async function login({ email, password }) {
  
  await sleep();
  const users = readUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (!user || user.passwordHash !== btoa(password)) {
    const e = new Error("Identifiants incorrects.");
    e.code = "BAD_CREDENTIALS";
    throw e;
  
    }
  
  return {id: user.id, email: user.email, fullName: user.fullName, token: crypto.randomUUID()};
}