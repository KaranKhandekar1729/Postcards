import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'username is required'],
        trim: true,
        unique: true,
        lowercase: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxLength: [12, 'Username cannot exceed 12 characters'],
        match: [/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores allowed']
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

userSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password)
}

const User = mongoose.model('User', userSchema);

export default User;