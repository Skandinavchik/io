import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    })
};

const signUp = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        const newUser = await User.create({
            userName,
            email,
            password,
        });

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser,
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                status: 'failed',
                message: 'Provide email and password',
            });
            return;
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePasswords(password))) {
            res.status(401).json({
                status: 'failed',
                message: 'Incorrect email or password',
            });
            return;
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token,
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

const protect = async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({
            status: 'failed',
            message: 'Please sign in to get access',
        });
        return;
    }

    
    next();
};

export { signUp, signIn, protect };