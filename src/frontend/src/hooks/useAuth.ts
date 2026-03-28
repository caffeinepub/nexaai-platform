const SESSION_KEY = "nexaai_session";
const USERS_KEY = "nexaai_users";

interface User {
  name: string;
  email: string;
  password: string;
}

interface Session {
  name: string;
  email: string;
}

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function register(
  name: string,
  email: string,
  password: string,
): boolean {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return false;
  }
  users.push({ name, email, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  // Auto-login
  const session: Session = { name, email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return true;
}

export function login(email: string, password: string): boolean {
  const users = getUsers();
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === password,
  );
  if (!user) return false;
  const session: Session = { name: user.name, email: user.email };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return true;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function getCurrentUser(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}
