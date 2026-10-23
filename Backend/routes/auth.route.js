import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import auth from '../middleware/auth.js';

const router = express.Router();

// ─── Upload Directory Setup ─────────────────────────────────────
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const safeName = file.originalname.replace(/\s+/g, '-').toLowerCase();
        cb(null, `${timestamp}-${safeName}`);
    },
});

const upload = multer({ storage });

// ─── Upload Profile Picture ─────────────────────────────────────
router.post('/upload-profile-picture', auth, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const baseUrl = process.env.BASE_URL || 'http://localhost:5050';
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profilePicture = imageUrl;
        await user.save();

        res.json({ message: 'Profile picture uploaded successfully', imageUrl });
    } catch (error) {
        console.error('Upload error:', error.message);
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
});

// ─── Delete Profile Picture ─────────────────────────────────────
router.delete('/profile-picture', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.profilePicture) {
            return res.status(404).json({ message: 'No profile picture to delete' });
        }

        const filePath = user.profilePicture.replace(`${process.env.BASE_URL || 'http://localhost:5050'}/`, '');
        fs.unlink(`./${filePath}`, (err) => {
            if (err) console.error('File delete error:', err.message);
        });

        user.profilePicture = '';
        await user.save();

        res.json({ message: 'Profile picture deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ message: 'Server error while deleting image' });
    }
});

// ─── Login ─────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture || '',
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ─── Register ──────────────────────────────────────────────────
router.post('/register', async (req, res) => {
    try {
        const { name, email, username, password, role = 'user' } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email already registered' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, username, password: hashedPassword, role });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
                profilePicture: '',
            },
        });
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: 'Registration failed', error: error.message });
    }
});

// ─── Forgot Password ───────────────────────────────────────────
const resetTokens = new Map();

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email not found.' });

        const token = crypto.randomBytes(32).toString('hex');
        const expireTime = Date.now() + 15 * 60 * 1000;
        resetTokens.set(token, { userId: user._id, expire: expireTime });

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Reset Your Password',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: 'Password reset link sent.' });
    } catch (error) {
        console.error('Forgot Password Error:', error.message);
        res.status(500).json({ message: 'Error sending reset email' });
    }
});

// ─── Reset Password ────────────────────────────────────────────
router.get('/reset-password', (req, res) => {
    const { token } = req.query;
    if (!token || !resetTokens.has(token)) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const { userId, expire } = resetTokens.get(token);
    if (Date.now() > expire) {
        resetTokens.delete(token);
        return res.status(400).json({ message: 'Token expired' });
    }

    res.json({ message: 'Token is valid', userId });
});

router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;
    if (!token || !resetTokens.has(token)) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const { userId, expire } = resetTokens.get(token);
    if (Date.now() > expire) {
        resetTokens.delete(token);
        return res.status(400).json({ message: 'Token expired' });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword });

        resetTokens.delete(token);
        res.json({ message: 'Password reset successful.' });
    } catch (error) {
        console.error('Password reset error:', error.message);
        res.status(500).json({ message: 'Failed to reset password' });
    }
});

export default router;
