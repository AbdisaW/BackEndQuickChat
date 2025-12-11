const jwt = require('jsonwebtoken');
const SECRET = 'your_super_secret_key'; 
function sign(payload, expiresIn = '1h') {
  return jwt.sign(payload, SECRET, { expiresIn });
}

function verify(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const decoded = verify(token);
  if (!decoded) return res.status(401).json({ error: 'Invalid token' });

  req.user = decoded;
  next();
}

module.exports = { sign, verify, authMiddleware };
