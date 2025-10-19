import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
import userRouter from './routes/users';

dotenv.config();

const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('success!');
})

app.use('/user', userRouter);

export default app;