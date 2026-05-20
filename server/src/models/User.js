import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'usernname is required'],
        trim: true,
        unique: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxLength: [12, 'Username cannot exceed 12 characters'],
        match: [/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores allowed']
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email',
        ],
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        select: false,
        minlength: [8, 'Password must be at least 8 characters long']
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true})

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
})

const User = mongoose.model('User', userSchema);

export default User;