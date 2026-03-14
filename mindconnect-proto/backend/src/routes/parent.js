const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.post('/add', authMiddleware, (req,res)=>{
  const { name, phone, relation } = req.body;
  if(!name || !phone) return res.status(400).json({ error:'Missing fields' });
  db.run(`INSERT INTO parents(user_id,name,phone,relation) VALUES(?,?,?,?)`, [req.user.id, name, phone, relation || ''], function(err){
    if(err) return res.status(500).json({ error: err.message });
    res.json({ id:this.lastID });
  });
});

module.exports = router;
