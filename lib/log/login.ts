import { titleCase } from '../../utils/str.utils';
import { getRuntimeConfig } from '../config/envs';
import { saveUserDataToLocalStorage } from './cookies';
export interface FormValues {
  email: string;
  password: string;
}

// Devuelve éxito o error con mensaje
// Para aparecer en un toaster en el cliente
export const validateAdminLogin = async (
  data: FormValues
): Promise<{ success: boolean; toastMessage?: string }> => {
  try {
    //return { success: true, toastMessage: "Inicio de sesión exitoso" };
    const cfg = await getRuntimeConfig();

    const login_url = new URL(cfg.LOGIN_PATH, cfg.MELODIA_USERS_API_URL);

    const res = await fetch(login_url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await res?.json();

    if (res.ok && body?.user?.role === "admin") {
      const message = "Inicio de sesión exitoso";
      saveUserDataToLocalStorage(body.token, body.refresh_token, body.user);
      return { success: true, toastMessage: message };
    } else if (res.ok && body) {
      return {
        success: false,
        toastMessage: "Solo los administradores pueden iniciar sesión aquí",
      };
    } else {
      // rechazar con mensaje para que toaster.promise muestre el error
      return {
        success: false,
        toastMessage: titleCase(body?.error) ?? "Credenciales inválidas",
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
      toastMessage:
        err instanceof Error ? err.message : "Ocurrió un error desconocido",
    };
  }
};

