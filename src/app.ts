import express, { Express, Request, Response } from 'express';
import dotenv from "dotenv";
import userRouter from './routes/users';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app: Express = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('success!');
})

app.use('/user', userRouter);
app.use(errorHandler);
export default app;