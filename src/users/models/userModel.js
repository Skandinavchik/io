import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: [2, 'Username must be longer then 2 characters'],
        maxlength: [40, 'Username must have less then 40 characters'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: [validator.isEmail, 'Invalid email'],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Password must be longer then 8 characters'],
        maxlength: [20, 'Password must have less then 20 characters'],
        select: false,
        trim: true,
    },
    role: {
        type: String,
        enum: ['guest', 'member', 'host', 'admin'],
        default: 'guest',
    },
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.comparePasswords = async function(candidatePassword)  {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export { User };