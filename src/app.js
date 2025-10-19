import express from 'express';
import dotenv from "dotenv";
import userRouter from './routes/users';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('success!');
})

app.use('/user', userRouter);

export default app;