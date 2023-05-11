const JWT = require('jsonwebtoken');
const db = require('../config/database');

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Authorization token required' });
  }
  const token = authorization.split(' ')[1];

  try {
    const { user_id } = JWT.verify(token, 'secret123');
    req.user = await db.query('SELECT user_id FROM users WHERE user_id = $1', [
      user_id,
    ]);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Token in not valid' });
  }
};

module.exports = requireAuth;
