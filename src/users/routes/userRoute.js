import express from "express";
import rateLimit from 'express-rate-limit';
import { getAllUsers, getUser, updateUser } from '../controllers/userController.js';
import { signUp, signIn, logout, protect } from "../controllers/authController.js";

const usersRouter = express.Router();

const limiter = rateLimit({
    max: 10,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests',
});

usersRouter.post('/signup', limiter, signUp);
usersRouter.post('/signin', limiter, signIn);
usersRouter.get('/logout', logout);

usersRouter.route('/')
    .get(protect, getAllUsers);

usersRouter.route('/:id')
    .get(protect, getUser)
    .patch(protect, updateUser);

export { usersRouter };