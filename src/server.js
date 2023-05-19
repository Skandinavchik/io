import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });
import express from 'express';
import cors from 'cors';
import { Server } from "socket.io";
import mongoose from 'mongoose';
import { usersRouter } from './users/routes/userRoute.js';


mongoose.connect(process.env.DB)
    .then(() => console.log('DB Connected 👌'))
    .catch(err => console.log(err));


const app = express();
const host = process.env.HOST;
const port = process.env.PORT;

app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use('/api/v1.0/users', usersRouter);




const server = app.listen(port, host, () => {
    console.log(`Server started on ${host}:${port} 🚀`);
});

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:3000']
    }
});

io.on('connection', socket => {
    console.log(`Connected: ${socket.id} 👋`);

    socket.on('send', (data) => {
        socket.broadcast.emit('recieve', data);
    });

    socket.on('disconnect', () => {
        console.log(`Disconnected: ${socket.id} ❌`);
    });
});