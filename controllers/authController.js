const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

// new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check already registered
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    // hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user in the database
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    // JWT token
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: '1h', // Token expiration time
    });

    // Return the token and user details
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};

// login a user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user with the given email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // generate jwt token
    const token = jwt.sign({ userId: user._id }, config.jwtSecret, {
      expiresIn: '1h', // Token expiration time
    });

    // return the token and user details
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server Error' });
  }
};
