const jwt = require('jsonwebtoken');
const db = require('../config/database');

// const requireAuth = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, 'access_secret', (err, user) => {
//       if (err) {
//         return res.status(403).json('Token is not valid');
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.status(401).json('You are not authenticated');
//   }
// };

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Authorization token required' });
  }
  const token = authorization.split(' ')[1];

  try {
    const { user_id } = jwt.verify(token, 'secret123');
    req.user = await db.query('SELECT user_id FROM users WHERE user_id = $1', [
      user_id,
    ]);
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = requireAuth;
