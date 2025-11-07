"use client";

type RuntimeConfig = {
    MELODIA_USERS_API_URL: string;
    LOGIN_PATH: string;
    LOGOUT_PATH: string;
};

// Memo en módulo para no pegarle mil veces al endpoint
let configPromise: Promise<RuntimeConfig> | null = null;

export function getRuntimeConfig(): Promise<RuntimeConfig> {
    if (!configPromise) {
        configPromise = fetch("/api/config", { cache: "no-store" })
            .then((r) => {
                if (!r.ok) throw new Error("No se pudo cargar la configuración");
                return r.json();
            })
            .catch((e) => {
                // Fallback seguro (strings vacíos) + surface del error
                console.error("Runtime config error:", e);
                return {
                    MELODIA_USERS_API_URL: "",
                    LOGIN_PATH: "",
                    LOGOUT_PATH: "",
                };
            });
    }
    return configPromise;
}
