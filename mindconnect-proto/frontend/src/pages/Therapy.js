import React from 'react';

export default function Therapy(){
  // For prototype: use Jitsi Meet external API by embedding an iframe to meet.jit.si/<room>
  const room = 'MindConnectRoomDemo' + (Math.floor(Math.random()*10000));
  const url = `https://meet.jit.si/${room}`;
  return (
    <div style={{padding:20}}>
      <h2>Therapy Session</h2>
      <p>Click Join to open an encrypted group room (Jitsi). For production integrate WebRTC with TURN server or licensed telehealth provider.</p>
      <a href={url} target="_blank" rel="noreferrer"><button>Join Session</button></a>
      <div style={{marginTop:16}}>
        <iframe title="jitsi" src={url} style={{width:'100%',height:500,border:0}} />
      </div>
    </div>
  );
}
