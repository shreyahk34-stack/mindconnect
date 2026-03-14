import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendMessage, anonLogin } from '../api';

function getLatestMoodForChatbot() {
  try {
    const raw = localStorage.getItem('moodHistory');
    if (!raw) return null;
    const history = JSON.parse(raw);
    if (!Array.isArray(history) || history.length === 0) return null;
    const latest = history[0];
    return latest?.mood || null;
  } catch (e) {
    return null;
  }
}

export default function Chatbot(){
  const navigate = useNavigate();
  const [msg, setMsg] = useState('');
  const [log, setLog] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure we have a token for authenticated chatbot calls
    (async () => {
      if (!localStorage.getItem('token')) {
        try {
          const res = await anonLogin();
          if (res && res.token) {
            localStorage.setItem('token', res.token);
          }
        } catch (e) {
          console.error('Anon login failed', e);
        }
      }
    })();
  }, []);

  const send = async ()=>{
    if(!msg.trim()) return;
    setError(null);
    setLoading(true);
    try{
      const moodContext = getLatestMoodForChatbot();
      setLog(l=>[...l, {from:'me', text:msg}]);
      const r = await sendMessage(msg, moodContext);

      let botText = r.text || '';
      if (r.moodText) {
        botText += `\n\n${r.moodText}`;
      }
      if (Array.isArray(r.suggestions) && r.suggestions.length > 0) {
        botText += `\n\nSuggestions:\n- ${r.suggestions.join('\n- ')}`;
      }

      setLog(l=>[...l, {from:'bot', text:botText}]);
      setMsg('');
      if(r.urgent) alert('System flagged urgent — please use Emergency button or contact counselor.');
    } catch (e){
      console.error('Chatbot error', e);
      setError('Chatbot is not reachable right now. Please check that the backend is running.');
    } finally{
      setLoading(false);
    }
  };
  return (
    <div style={{padding:20}}>
      <h2>AI Chatbot</h2>
      <div className="chatbox">
        {log.map((m,i)=>(
          <div
            key={i}
            className={m.from==='me'?'msg me':'msg bot'}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {m.text}
          </div>
        ))}
      </div>
      {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
      <input value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Type here..." />
      <button onClick={send} disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
      <div style={{marginTop:12}}>
        <button onClick={() => navigate('/therapy')}>Connect to Counselor</button>
        <button
          style={{marginLeft:8}}
          onClick={async () => {
            const e = await (await fetch('http://localhost:4000/api/emergency/help')).json();
            alert(JSON.stringify(e, null, 2));
          }}
        >
          Emergency
        </button>
      </div>
    </div>
  );
}