const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'dev_secret_key';

function authMiddleware(req,res,next){
  const h = req.headers.authorization;
  if(!h) return res.status(401).json({ error:'No token' });
  const token = h.split(' ')[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error:'Invalid token' });
  }
}
module.exports = { authMiddleware, SECRET };
