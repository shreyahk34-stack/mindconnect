const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const db = require('../db');

function scorePHQ9(answers){
  const score = answers.reduce((a,b)=>a+(parseInt(b)||0),0);
  let cat='minimal';
  if(score>=20) cat='severe';
  else if(score>=15) cat='moderately severe';
  else if(score>=10) cat='moderate';
  else if(score>=5) cat='mild';
  return { score, category:cat };
}
function scoreGHQ(answers){
  const score = answers.reduce((a,b)=>a+(parseInt(b)||0),0);
  let cat='low distress';
  if(score>=18) cat='severe distress';
  else if(score>=12) cat='moderate distress';
  else if(score>=6) cat='mild distress';
  return { score, category:cat };
}
function scoreBDI(answers){
  const score = answers.reduce((a,b)=>a+(parseInt(b)||0),0);
  let cat='minimal';
  if(score>=29) cat='severe';
  else if(score>=20) cat='moderate';
  else if(score>=14) cat='mild';
  return { score, category:cat };
}
function scoreMMPI(answers){
  const score = answers.reduce((a,b)=>a+(parseInt(b)||0),0);
  let cat='within typical range';
  if(score>=18) cat='elevated distress / traits';
  else if(score>=10) cat='some elevated distress / traits';
  return { score, category:cat };
}
function scoreGAD7(answers){
  const score = answers.reduce((a,b)=>a+(parseInt(b)||0),0);
  let cat='minimal';
  if(score>=15) cat='severe';
  else if(score>=10) cat='moderate';
  else if(score>=5) cat='mild';
  return { score, category:cat };
}

router.post('/submit', authMiddleware, (req,res)=>{
  const { type, answers } = req.body;
  if(!type || !Array.isArray(answers)) return res.status(400).json({ error:'Bad request'});
  let result;
  if(type === 'PHQ9') result = scorePHQ9(answers);
  else if(type === 'GAD7') result = scoreGAD7(answers);
  else if(type === 'GHQ') result = scoreGHQ(answers);
  else if(type === 'BDI') result = scoreBDI(answers);
  else if(type === 'MMPI') result = scoreMMPI(answers);
  else result = scorePHQ9(answers);
  db.run(`INSERT INTO screenings(user_id,type,answers,score,category) VALUES(?,?,?,?,?)`, [req.user.id, type, JSON.stringify(answers), result.score, result.category], function(err){
    if(err) return res.status(500).json({ error: err.message });
    const needsImmediateFollowup =
      result.category === 'severe' ||
      result.category === 'moderately severe' ||
      result.category === 'severe distress';
    res.json({ id: this.lastID, ...result, needsImmediateFollowup });
  });
});

router.get('/history', authMiddleware, (req,res)=>{
  db.all(`SELECT id,type,score,category,created_at FROM screenings WHERE user_id=? ORDER BY created_at DESC LIMIT 20`, [req.user.id], (err,rows)=>{
    if(err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
