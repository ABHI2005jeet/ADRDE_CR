/**
 * Placeholder API client for future backend integration.
 * Replace BASE_URL and implement real fetch calls against backend_placeholder/api routes.
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function apiGet(path) {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) throw new Error(`GET ${path} failed`);
  return response.json();
}

export async function apiPost(path, body) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`POST ${path} failed`);
  return response.json();
}
