const BASE = process.env.REACT_APP_API || 'http://localhost:4000';

export async function anonLogin(){
  const res = await fetch(`${BASE}/api/auth/anon`, { method:'POST' });
  return res.json();
}

export async function register({ username, password }){
  const res = await fetch(`${BASE}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export async function login({ username, password }){
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.json();
}

export function authHeaders(){ return { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }
export async function submitScreening(type, answers){
  const res = await fetch(`${BASE}/api/screening/submit`, { method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify({ type, answers })});
  return res.json();
}
export async function history(){ const r = await fetch(`${BASE}/api/screening/history`, { headers: authHeaders()}); return r.json(); }
export async function sendMessage(message, moodContext){ 
  const r = await fetch(`${BASE}/api/chatbot/message`, { 
    method:'POST', 
    headers:{'Content-Type':'application/json', ...authHeaders()}, 
    body: JSON.stringify({ message, mood: moodContext || null })
  }); 
  return r.json(); 
}
export async function getNearby(lat,lng){ const q = `?lat=${lat}&lng=${lng}`; const r = await fetch(`${BASE}/api/counselors/nearby${q}`, { headers: authHeaders()}); return r.json(); }
export async function getEmergency(){ const r = await fetch(`${BASE}/api/emergency/help`); return r.json(); }
export async function bookSession(counselor_id, scheduled_at){ const r = await fetch(`${BASE}/api/sessions/book`, { method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify({ counselor_id, scheduled_at })}); return r.json(); }
export async function addParent(data){ const r = await fetch(`${BASE}/api/parent/add`, { method:'POST', headers:{'Content-Type':'application/json', ...authHeaders()}, body: JSON.stringify(data)}); return r.json(); }
