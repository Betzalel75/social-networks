// src/auth/auth.js
export function isAuthenticated() {
  const token = localStorage.getItem('cookie');
  return !!token; // Retourne vrai si l'utilisateur est authentifié, faux sinon
}
