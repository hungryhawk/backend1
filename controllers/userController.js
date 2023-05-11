const db = require('../config/database');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

let refreshTokens = [];

const refreshUser = async (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) return res.status(401).json('You are not authenticated');
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(403).json('Refresh Token is not valid');
  }
  jwt.verify(refreshToken, 'secret321', (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateAccessToken(user);

    refreshTokens.push(newRefreshToken);
    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
};

const getUser = async (req, res) => {
  const users = await db.query('SELECT * FROM users');
  res.json(users.rows);
};

// -------------

const generateAccessToken = (user) => {
  return jwt.sign({ id: user }, 'secret123', {
    expiresIn: '20s',
  });
};
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user }, 'secret321');
};

// ------------

const loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array(),
    });
  }
  const { username, password } = req.body;
  const user = await db.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);

  if (user.rows.length === 0) {
    return res
      .status(401)
      .json({ message: 'Password or username is incorrect' });
  }
  const validPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!validPassword) {
    return res
      .status(401)
      .json({ message: 'Password or username is incorrect' });
  }

  const accessToken = generateAccessToken(user.rows[0].user_id);
  const refreshToken = generateRefreshToken(user.rows[0].user_id);
  refreshTokens.push(refreshToken);

  res.status(200).json({
    id: user.rows[0].user_id,
    username: user.rows[0].username,
    token: accessToken,
    refresh: refreshToken,
  });
};

const registerUser = async (req, res) => {
  const { username, password, first_name, last_name, age, confirmPassword } =
    req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array(),
    });
  }

  const userExist = await db.query('SELECT * FROM users WHERE username = $1', [
    username,
  ]);

  if (userExist.rows.length !== 0) {
    return res.status(400).json({ message: 'User already exist' });
  }

  const salt = await bcrypt.genSalt(10);
  const bcryptPassword = await bcrypt.hash(password, salt);

  const newUser = await db.query(
    'INSERT INTO users (username, password, first_name, last_name, age) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [username, bcryptPassword, first_name, last_name, age]
  );

  const accessToken = generateAccessToken(newUser.rows[0].user_id);
  const refreshToken = generateRefreshToken(newUser.rows[0].user_id);
  //   показываем usera при добавлении
  if (newUser.rows[0]) {
    res.status(201).json({
      id: newUser.rows[0].user_id,
      username: newUser.rows[0].username,
      age: newUser.rows[0].age,
      token: accessToken,
      refresh: refreshToken,
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

module.exports = {
  loginUser,
  registerUser,
  refreshUser,
  getUser,
};
