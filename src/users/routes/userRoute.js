import express from "express";
import { getAllUsers, getUser, updateUser } from '../controllers/userController.js';
import { signUp, signIn, logout, protect } from "../controllers/authController.js";

const usersRouter = express.Router();

usersRouter.post('/signup', signUp);
usersRouter.post('/signin', signIn);
usersRouter.get('/logout', logout);

usersRouter.route('/')
    .get(protect, getAllUsers);

usersRouter.route('/:id')
    .get(protect, getUser)
    .patch(protect, updateUser);

export { usersRouter };