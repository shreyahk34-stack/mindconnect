const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const db = require('../db');

router.post('/book', authMiddleware, (req,res)=>{
  const { counselor_id, scheduled_at } = req.body;
  if(!counselor_id || !scheduled_at) return res.status(400).json({ error:'Missing fields' });
  db.run(`INSERT INTO sessions(user_id,counselor_id,scheduled_at,status) VALUES(?,?,?,?)`, [req.user.id, counselor_id, scheduled_at, 'scheduled'], function(err){
    if(err) return res.status(500).json({ error: err.message });
    res.json({ id:this.lastID, counselor_id, scheduled_at, status:'scheduled' });
  });
});

router.get('/my', authMiddleware, (req,res)=>{
  db.all(`SELECT * FROM sessions WHERE user_id=? ORDER BY scheduled_at DESC`, [req.user.id], (err,rows)=>{
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
