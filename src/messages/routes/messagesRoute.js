import express from "express";
import { getMessages, createMessage } from "../controllers/messagesController.js";


const messagesRouter = express.Router();

messagesRouter.route('/')
    .post(createMessage);

messagesRouter.route('/:id')
    .get(getMessages);

export { messagesRouter };