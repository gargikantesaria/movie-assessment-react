import { atom } from "jotai";

function getUserLoginDataFromSessionStorage() {
    let sessionStorage = {};
    if (global.sessionStorage) {
        try {
            const userLoginData = global.sessionStorage.getItem("userLogin");
            userLoginData ? sessionStorage = JSON.parse(userLoginData) : sessionStorage = null;
        } catch (err) {
        }
    }
    return sessionStorage;
}

export const authenticatedUserInfo = atom(getUserLoginDataFromSessionStorage() || null);
