const API_BASE = 'http://localhost:8000';

export async function summarize(video_url, token) {
  const res = await fetch(`${API_BASE}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ video_url }),
  });
  return res.json();
}

export async function getHistory(user_id) {
  const res = await fetch(`${API_BASE}/history/${user_id}`);
  return res.json();
}

export async function register(email, password) {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}
