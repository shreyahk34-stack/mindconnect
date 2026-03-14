const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { SECRET } = require('../middleware/auth');
const db = require('../db');

const SALT_ROUNDS = 10;

function createToken(user){
  const payload = { id: user.id, username: user.username || null, anon: !!user.anon };
  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
}

// Anonymous login (creates anon user id)
router.post('/anon', (req,res)=>{
  const id = uuidv4();
  db.run("INSERT INTO users(id, anon) VALUES(?,1)", [id], function(err){
    if(err) return res.status(500).json({ error: err.message });
    const token = createToken({ id, anon: true });
    res.json({ token, user:{ id, anon:true }});
  });
});

// Register with username/password
router.post('/register', (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'Username and password are required' });
  const normalized = username.trim().toLowerCase();

  db.get(`SELECT id FROM users WHERE username = ?`, [normalized], (err, existing) => {
    if(err) return res.status(500).json({ error: err.message });
    if(existing) return res.status(409).json({ error: 'Username already taken' });

    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
      if(err) return res.status(500).json({ error: err.message });
      const id = uuidv4();
      db.run(
        `INSERT INTO users(id, anon, username, password) VALUES(?,?,?,?)`,
        [id, 0, normalized, hash],
        function(err){
          if(err) return res.status(500).json({ error: err.message });
          const token = createToken({ id, username: normalized, anon: false });
          res.json({ token, user:{ id, username: normalized } });
        }
      );
    });
  });
});

// Login with username/password
router.post('/login', (req,res)=>{
  const { username, password } = req.body;
  if(!username || !password) return res.status(400).json({ error: 'Username and password are required' });
  const normalized = username.trim().toLowerCase();

  db.get(`SELECT id, password FROM users WHERE username = ?`, [normalized], (err, user) => {
    if(err) return res.status(500).json({ error: err.message });
    if(!user) return res.status(401).json({ error: 'Invalid credentials' });

    bcrypt.compare(password, user.password, (err, match) => {
      if(err) return res.status(500).json({ error: err.message });
      if(!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = createToken({ id: user.id, username: normalized, anon: false });
      res.json({ token, user:{ id: user.id, username: normalized } });
    });
  });
});

// Get current user profile
router.get('/me', require('../middleware/auth').authMiddleware, (req, res) => {
  res.json({ user: { id: req.user.id, username: req.user.username, anon: req.user.anon } });
});

// Change password (requires current password)
router.post('/change-password', require('../middleware/auth').authMiddleware, (req,res)=>{
  const { oldPassword, newPassword } = req.body;
  if(!oldPassword || !newPassword) return res.status(400).json({ error:'Both oldPassword and newPassword are required' });

  db.get(`SELECT password FROM users WHERE id = ?`, [req.user.id], (err, row) => {
    if(err) return res.status(500).json({ error: err.message });
    if(!row || !row.password) return res.status(400).json({ error: 'Password cannot be changed for anonymous accounts.' });

    bcrypt.compare(oldPassword, row.password, (err, match) => {
      if(err) return res.status(500).json({ error: err.message });
      if(!match) return res.status(401).json({ error: 'Current password is incorrect' });

      bcrypt.hash(newPassword, SALT_ROUNDS, (err, hash) => {
        if(err) return res.status(500).json({ error: err.message });
        db.run(`UPDATE users SET password = ? WHERE id = ?`, [hash, req.user.id], function(err){
          if(err) return res.status(500).json({ error: err.message });
          res.json({ success: true });
        });
      });
    });
  });
});

module.exports = router;
