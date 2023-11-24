//authentication.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const { promisify } = require('util');

const db = mysql.createConnection({

});

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 *1000
    ),
    httpOnly: true
  };

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await db.promise().query(
      'INSERT INTO user (username, email, password, passwordConfirm) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, passwordConfirm]
    );

    createSendToken(newUser, 201, res);
  } catch (err) {
    console.log(err);
  }
};

