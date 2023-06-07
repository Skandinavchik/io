import express from "express";
import { getConversations, createConversation } from "../controllers/conversationsController.js";



const conversationsRouter = express.Router();

conversationsRouter.route('/')
    .post(createConversation);

conversationsRouter.route('/:id')
    .get(getConversations);


export { conversationsRouter };