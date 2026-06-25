import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const register =  asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    const user = await User.create({ username, password });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.cookie('token', token, cookieOptions)
    res.status(201).json({ success: true, data: { _id: user._id, username: user.username } })
})

export const login = asyncHandler(async (req, res) => {
    const { username, password } = req.body

    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError('Invalid username or password', 401);
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token', token, cookieOptions);
    res.status(200).json({ success: true, data: { _id: user._id, username: user.username } })
})

export const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' })
    res.status(200).json({ success: true, message: 'Logged out' });
})

export const getMe = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: req.user })
})