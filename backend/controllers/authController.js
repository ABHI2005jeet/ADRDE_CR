import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { createResetToken, departmentForRole, sendPasswordResetEmail } from '../utils/helpers.js';
import { logActivity, emitNotification } from '../utils/events.js';

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role, employeeId } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, ...(employeeId ? [{ employeeId: employeeId.toUpperCase() }] : [])] });
    if (exists) return res.status(409).json({ message: 'User already exists with this email or employee ID' });

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: role || 'Staff',
      employeeId: (employeeId || `ADRDE-${Date.now().toString().slice(-6)}`).toUpperCase(),
      department: departmentForRole(role || 'Staff'),
    });

    await logActivity('User registration completed', user.name, user._id, 'auth');
    const notification = await Notification.create({
      title: 'Welcome to ADRDE Portal',
      message: `Account created for ${user.name}`,
      type: 'System',
      category: 'Updates',
      userId: user._id,
    });
    emitNotification(req.io, user._id, notification);

    const token = signToken(user);
    res.status(201).json({ token, user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase()?.trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (user.status !== 'Active') {
      return res.status(403).json({ message: 'Account is inactive' });
    }
    await logActivity('User login activity', user.name, user._id, 'auth');
    const token = signToken(user);
    res.json({ token, user: user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res) {
  res.json({ user: req.user.toPublicJSON() });
}

export async function updateProfile(req, res, next) {
  try {
    const { name, department, contactInfo, profileImage } = req.body;
    if (name) req.user.name = name.trim();
    if (department) req.user.department = department;
    if (contactInfo !== undefined) req.user.contactInfo = contactInfo;
    if (profileImage !== undefined) req.user.profileImage = profileImage;
    await req.user.save();
    await logActivity('Profile updated', req.user.name, req.user._id, 'profile');
    res.json({ user: req.user.toPublicJSON() });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase()?.trim() });
    if (!user) {
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }
    const { token, hash, expires } = createResetToken();
    user.resetPasswordToken = hash;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}?email=${encodeURIComponent(user.email)}`;
    const emailResult = await sendPasswordResetEmail({ email: user.email, name: user.name, resetUrl });

    await Notification.create({
      title: 'Password reset requested',
      message: 'A password reset link was generated for your account.',
      type: 'Security',
      category: 'Alerts',
      userId: user._id,
    });

    res.json({
      message: 'If that email exists, a reset link has been sent.',
      ...(process.env.NODE_ENV !== 'production' && emailResult),
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, email, password } = req.body;
    if (!token || !email || !password) {
      return res.status(400).json({ message: 'Token, email and new password are required' });
    }
    const crypto = await import('crypto');
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordToken: hash,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    await logActivity('Password reset completed', user.name, user._id, 'auth');
    res.json({ message: 'Password updated successfully. You can login now.' });
  } catch (error) {
    next(error);
  }
}
