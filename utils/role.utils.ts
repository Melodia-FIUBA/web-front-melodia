export function getRoleColors(role: string): {
  bg: string;
  color: string;
} {
  switch (role) {
    case "artist":
      return { bg: "pink.100", color: "pink.800" };
    case "listener":
      return { bg: "yellow.100", color: "yellow.800" };
    case "admin":
      return { bg: "blue.100", color: "blue.800" };
    default:
      return { bg: "gray.100", color: "gray.800" };
  }
}
