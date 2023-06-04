import jwt from 'jsonwebtoken';
import { promisify } from 'util';
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

        newUser.password = undefined;
        const token = signToken(newUser._id);

        res.cookie('jwt', token, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            origin: 'http://localhost:3000',
        });
        res.cookie('data', 'data', {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: false,
            origin: 'http://localhost:3000',
        });

        res.status(201).json({
            status: 'success',
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

        user.password = undefined;
        const token = signToken(user._id);

        res.cookie('jwt', token, {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            origin: 'http://localhost:3000',
        });
        res.cookie('data', 'data', {
            maxAge: 14 * 24 * 60 * 60 * 1000,
            httpOnly: false,
            origin: 'http://localhost:3000',
        });

        res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });

    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        maxAge: 1,
        httpOnly: true,
        origin: 'http://localhost:3000',
    });
    res.cookie('data', 'data', {
        maxAge: 1,
        httpOnly: false,
        origin: 'http://localhost:3000',
    });

    res.status(200).json({
        status: 'success',
    });
};

const protect = async (req, res, next) => {
    try {
        let token;
        const { authorization } = req.headers;

        if (authorization && authorization.startsWith('Bearer')) {
            token = authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            res.status(401).json({
                status: 'failed',
                message: 'Please sign in to get access',
            });
            return;
        }

        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({
                status: 'failed',
                message: 'User with this token no longer exists',
            });
            return;
        }

        next();
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            message: error.message,
        });
    }
};

export { signUp, signIn, logout, protect };