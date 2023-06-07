import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { Server } from "socket.io";
import { usersRouter } from './users/routes/userRoute.js';
import { conversationsRouter } from './messages/routes/conversationsRoute.js';
import { messagesRouter } from './messages/routes/messagesRoute.js';


mongoose.connect(process.env.DB)
    .then(() => console.log('DB Connected 👌'))
    .catch(err => console.log(err));

const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
};

app.use(helmet());
app.use(express.json());
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(cookieParser());


app.use('/api/v1.0/users', usersRouter);
app.use('/api/v1.0/conversations', conversationsRouter);
app.use('/api/v1.0/messages', messagesRouter);


const server = app.listen(port, host, () => {
    console.log(`Server started on ${host}:${port} 🚀`);
});

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000'],
        credentials: true,
    }
});

io.on('connection', socket => {
    console.log(`Connected: ${socket.id} 👋`);

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id} ❌`);
    });
});