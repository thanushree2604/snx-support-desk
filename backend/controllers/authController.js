const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const mailer = require('../config/mailer');

exports.register = async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();
    const role = (req.body.role || 'user').trim();
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const acceptedRoles = ['user', 'support', 'admin'];
    if (!acceptedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role selected' });
    }

    const existing = await userModel.findByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ name, email, password: hashedPassword, role });

    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      mailer.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Welcome to Support Dashboard',
        html: `<p>Hi ${name},</p><p>Your account has been created successfully. Log in to submit tickets and access support.</p>`
      }).catch(() => null);
    }

    res.status(201).json({ message: 'Registration successful', userId: newUser.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to register', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const password = (req.body.password || '').trim();
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await userModel.findByEmail(email);
    if (!user) {
      return res.status(200).json({ message: 'If the email exists, reset instructions will be sent.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '30m' });
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset?token=${token}`;

    if (process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
      await mailer.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: 'Reset your Support Hub password',
        html: `
          <p>Hi ${user.name},</p>
          <p>Use the link below to reset your password. The link expires in 30 minutes.</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you did not request this change, ignore this email.</p>
        `
      });
    }

    res.json({ message: 'Password reset instructions have been sent if the email exists.' });
  } catch (error) {
    res.status(500).json({ message: 'Unable to process reset request', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(400).json({ message: 'Invalid or expired reset token' });

      const user = await userModel.findById(decoded.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.updatePassword(user.id, hashedPassword);
      res.json({ message: 'Password reset successfully. You may now sign in.' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to reset password', error: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Profile not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Unable to fetch profile', error: error.message });
  }
};
