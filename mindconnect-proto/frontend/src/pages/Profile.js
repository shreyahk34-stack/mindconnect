import React, { useEffect, useState } from 'react';
import { authHeaders } from '../api';

export default function Profile(){
  const [user, setUser] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [status, setStatus] = useState('');

  useEffect(()=>{
    fetch('/api/auth/me', { headers: authHeaders() })
      .then(r=>r.json())
      .then(d=>{
        if(d.user) setUser(d.user);
        else setStatus(d.error || 'Failed to load profile');
      })
      .catch(()=>setStatus('Failed to load profile'));
  }, []);

  const handleChangePassword = async () => {
    setStatus('Updating password...');
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify({ oldPassword: currentPassword, newPassword }),
    });
    const data = await res.json();
    if (data.success) {
      setStatus('Password changed successfully.');
      setCurrentPassword('');
      setNewPassword('');
    } else {
      setStatus(data.error || 'Failed to update password');
    }
  };

  if (!user) {
    return (
      <div style={{padding:20}}>
        <h2>Profile</h2>
        <p>{status || 'Loading user profile...'}</p>
      </div>
    );
  }

  return (
    <div style={{padding:20}}>
      <h2>Profile</h2>
      <p><strong>Username:</strong> {user.username || 'Anonymous'}</p>
      <p><strong>User ID:</strong> {user.id}</p>
      <div style={{marginTop: 20}}>
        <h3>Change Password</h3>
        <div style={{marginBottom: 8}}>
          <input
            type="password"
            value={currentPassword}
            placeholder="Current password"
            onChange={(e)=>setCurrentPassword(e.target.value)}
            style={{width:'100%', padding:8}}
          />
        </div>
        <div style={{marginBottom: 8}}>
          <input
            type="password"
            value={newPassword}
            placeholder="New password"
            onChange={(e)=>setNewPassword(e.target.value)}
            style={{width:'100%', padding:8}}
          />
        </div>
        <button onClick={handleChangePassword} disabled={!currentPassword || !newPassword}>
          Update Password
        </button>
      </div>
      {status && (
        <div style={{marginTop: 16, padding: 10, border: '1px solid #ddd', borderRadius: 4}}>
          {status}
        </div>
      )}
    </div>
  );
}
