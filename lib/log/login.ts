
export interface FormValues {
  username: string;
  password: string;
}

// Devuelve éxito o error con mensaje
// Para aparecer en un toaster en el cliente
export const validateAdminLogin = async (
  data: FormValues
): Promise<{ success: boolean; message?: string }> => {
  try {
    return { success: true, message: "Inicio de sesión exitoso" };

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const body = await res.json().catch(() => ({}));
    // TODO: manejar token o sesión aquí
    if (res.ok) {
      const message = "Inicio de sesión exitoso";
      return { success: true, message: message };
    } else {
      // rechazar con mensaje para que toaster.promise muestre el error
      return {
        success: false,
        message: body?.message ?? "Credenciales inválidas",
      };
    }
  } catch (err: unknown) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "Ocurrió un error desconocido",
    };
  }
};