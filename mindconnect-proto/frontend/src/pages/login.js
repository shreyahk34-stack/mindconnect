import React, { useState, useEffect } from 'react';
import { anonLogin, login, register } from '../api';
import { useNavigate } from 'react-router-dom';

const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

function getStoredPhrase(){
  return localStorage.getItem('voiceAuthPhrase') || '';
}

function parseJwt(token){
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export default function Login(){
  const nav = useNavigate();
  const [voicePhrase, setVoicePhrase] = useState(getStoredPhrase());
  const [passphraseInput, setPassphraseInput] = useState('');
  const [status, setStatus] = useState('');
  const [recording, setRecording] = useState(false);
  const [authUsername, setAuthUsername] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(()=>{
    setVoicePhrase(getStoredPhrase());
    const token = localStorage.getItem('token');
    if(token) setCurrentUser(parseJwt(token));
  }, []);

  const handleAnon = async () => {
    setStatus('Logging in anonymously...');
    try {
      const res = await anonLogin();
      if (res && res.token) {
        localStorage.setItem('token', res.token);
        setCurrentUser(parseJwt(res.token));
        setStatus('Anonymous login successful. Redirecting...');
        nav('/dashboard');
      } else {
        setStatus(res?.error || 'Anonymous login failed.');
      }
    } catch (e) {
      setStatus('Anonymous login error. Please try again.');
    }
  };

  const handleRegister = async () => {
    if (!authUsername.trim() || !authPassword) {
      setStatus('Username and password are required to register.');
      return;
    }
    const res = await register({ username: authUsername, password: authPassword });
    if (res.token) {
      localStorage.setItem('token', res.token);
      setCurrentUser(parseJwt(res.token));
      setStatus('Registration successful! Redirecting...');
      nav('/dashboard');
    } else {
      setStatus(res.error || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    if (!authUsername.trim() || !authPassword) {
      setStatus('Username and password are required to login.');
      return;
    }
    const res = await login({ username: authUsername, password: authPassword });
    if (res.token) {
      localStorage.setItem('token', res.token);
      setCurrentUser(parseJwt(res.token));
      setStatus('Login successful! Redirecting...');
      nav('/dashboard');
    } else {
      setStatus(res.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setStatus('Logged out successfully.');
  };

  const startRecognition = (onResult)=>{
    if (!SpeechRecognition) {
      setStatus('Voice authentication is not supported in this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setRecording(true);
      setStatus('Listening... please say your passphrase clearly.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim();
      onResult(transcript);
    };

    recognition.onerror = (event) => {
      setStatus('Voice recognition error: ' + (event.error || 'unknown'));
    };

    recognition.onend = () => {
      setRecording(false);
    };

    recognition.start();
    return recognition;
  };

  const handleSetupVoice = () => {
    setStatus('Preparing to record your voice passphrase...');
    startRecognition((transcript) => {
      if (!transcript) {
        setStatus('No speech detected. Please try again.');
        return;
      }
      localStorage.setItem('voiceAuthPhrase', transcript);
      setVoicePhrase(transcript);
      setStatus('Voice passphrase set. You can now use voice login.');
    });
  };

  const handleVoiceLogin = async () => {
    const stored = getStoredPhrase();
    if (!stored) {
      setStatus('No voice passphrase is configured. Please set it up first.');
      return;
    }

    setStatus('Starting voice login...');
    startRecognition(async (transcript) => {
      if (!transcript) {
        setStatus('No speech detected. Please try again.');
        return;
      }
      const normalized = transcript.toLowerCase();
      const expected = stored.toLowerCase();
      if (normalized === expected) {
        setStatus('Voice match successful. Logging in...');
        await handleAnon();
      } else {
        setStatus(`Voice did not match. Heard: "${transcript}"`);
      }
    });
  };

  const clearVoicePassphrase = () => {
    localStorage.removeItem('voiceAuthPhrase');
    setVoicePhrase('');
    setStatus('Voice passphrase cleared.');
  };

  const handleSetPassphrase = () => {
    if (!passphraseInput.trim()) {
      setStatus('Please enter a non-empty passphrase.');
      return;
    }
    localStorage.setItem('voiceAuthPhrase', passphraseInput.trim());
    setVoicePhrase(passphraseInput.trim());
    setStatus('Passphrase set. You can now log in using voice or text.');
  };

  const handleTextLogin = async () => {
    const stored = getStoredPhrase();
    if (!stored) {
      setStatus('No passphrase is configured. Please set it up first.');
      return;
    }
    if (passphraseInput.trim().toLowerCase() === stored.toLowerCase()) {
      setStatus('Passphrase match successful. Logging in...');
      await handleAnon();
    } else {
      setStatus('Passphrase did not match. Please try again.');
    }
  };

  return (
    <div style={{padding:20}}>
      <h2>Sign In</h2>

      {currentUser ? (
        <div style={{marginBottom:16, padding:12, border:'1px solid #ccc', borderRadius:6, background:'#f9f9f9'}}>
          <strong>Signed in as:</strong> {currentUser.username || 'Anonymous'}
          <button onClick={handleLogout} style={{marginLeft:10}}>Logout</button>
        </div>
      ) : (
        <div style={{marginBottom:16}}>
          <div style={{marginBottom:12}}>
            <strong>Professional Account</strong> (username + password)
          </div>
          <div style={{display:'flex', gap:10, flexWrap:'wrap', marginBottom:12}}>
            <input
              value={authUsername}
              onChange={(e) => setAuthUsername(e.target.value)}
              placeholder="Username"
              style={{flex:'1 1 220px', padding:8}}
            />
            <input
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="Password"
              style={{flex:'1 1 220px', padding:8}}
            />
          </div>
          <div style={{marginBottom:16}}>
            <button onClick={handleLogin} style={{marginRight:10}}>Login</button>
            <button onClick={handleRegister}>Register</button>
          </div>
        </div>
      )}

      <hr style={{margin:'20px 0'}} />

      <h3>Voice / Passphrase Authentication</h3>
      <p>
        You can set a passphrase and log in by speaking it, or by typing it.
        Voice login uses your browser's Speech Recognition API and is not a secure biometric authentication.
      </p>

      <div style={{marginBottom: 12}}>
        <strong>Current passphrase:</strong> {voicePhrase ? <em>{voicePhrase}</em> : <em>not set</em>}
      </div>

      <div style={{marginBottom: 12}}>
        <input
          value={passphraseInput}
          onChange={(e) => setPassphraseInput(e.target.value)}
          placeholder="Type your passphrase here"
          style={{width: '100%', padding: 8, boxSizing: 'border-box'}}
        />
      </div>

      <div style={{marginBottom: 12}}>
        <button onClick={handleSetPassphrase} style={{marginRight: 10}}>
          Set Passphrase
        </button>
        <button onClick={handleTextLogin} disabled={!passphraseInput.trim()} style={{marginRight: 10}}>
          Login with Passphrase
        </button>
      </div>

      <div style={{marginBottom: 12}}>
        <button onClick={handleSetupVoice} disabled={recording} style={{marginRight: 10}}>
          {recording ? 'Recording...' : 'Setup Voice Passphrase'}
        </button>
        <button onClick={handleVoiceLogin} disabled={recording || !voicePhrase} style={{marginRight: 10}}>
          {recording ? 'Recording...' : 'Login with Voice'}
        </button>
        <button onClick={clearVoicePassphrase} disabled={recording || !voicePhrase}>
          Clear Passphrase
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
