import React, { useState } from 'react';
import { addParent } from '../api';

export default function ParentForm(){
  const [f, setF] = useState({ name:'', phone:'', relation:''});
  const submit = async ()=>{ const r = await addParent(f); alert('Saved: ' + JSON.stringify(r)); setF({name:'',phone:'',relation:''}); };
  return (
    <div style={{padding:20}}>
      <h2>Parental Details (optional)</h2>
      <div style={{display:'grid',gap:8,maxWidth:400}}>
        <input placeholder="Name" value={f.name} onChange={e=>setF({...f,name:e.target.value})}/>
        <input placeholder="Phone" value={f.phone} onChange={e=>setF({...f,phone:e.target.value})}/>
        <input placeholder="Relation" value={f.relation} onChange={e=>setF({...f,relation:e.target.value})}/>
        <button onClick={submit}>Save</button>
      </div>
    </div>
  );
}
