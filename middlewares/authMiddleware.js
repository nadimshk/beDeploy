const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');

// authenticate user
exports.authenticateUser = async (req, res, next) => {
  const token = req.header('Authorization'); // get token from header

  if (!token) {
    return res.status(401).json({ error: 'token missing' }); // token missing
  }

  try {
    const decodedToken = jwt.verify(token, config.jwtSecret); // verify token

    req.user = decodedToken; // attach user info

    const user = await User.findById(decodedToken.userId); // find user

    if (!user) {
      return res.status(401).json({ error: 'user not found' }); // user not found
    }

    next(); // move to next middleware
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: 'invalid token' }); // invalid token
  }
};
