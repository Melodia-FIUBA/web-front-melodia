
"use client";

export function saveUserDataToLocalStorage(token: string, refreshToken: string, user: any) {
    localStorage.setItem("token", token);
    localStorage.setItem("refresh_token", refreshToken);
    localStorage.setItem("user.id", user.id);
    localStorage.setItem("user.username", user.username);
    localStorage.setItem("user.email", user.email);
    localStorage.setItem("user.role", user.role);
}

export function getToken() {
    return localStorage.getItem("token");
}

export function loadUserFromLocalStorage() {
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");
    const id = localStorage.getItem("user.id");
    const username = localStorage.getItem("user.username");
    const email = localStorage.getItem("user.email");
    const role = localStorage.getItem("user.role");
    return { token, refreshToken, user: { id, username, email, role } };
}

export function clearUserDataFromLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user.id");
    localStorage.removeItem("user.username");
    localStorage.removeItem("user.email");
    localStorage.removeItem("user.role");
}

// Devuelve si el admin está logueado en el cliente para el pedido de configuración
export function adminLoginData() : [string, string] {
    try {
        const role = localStorage.getItem("user.role");
        const token = localStorage.getItem("token");
        return [token ?? "", role ?? ""];
    } catch {
        return ["", ""];
    }
}

// Devuelve si hay admin logueado 
export function isAdminLoggedIn(): boolean {
    const [token, role] = adminLoginData();
    const isToken = token !== "";
    const isRole = role === "admin";
    return isToken && isRole;
}