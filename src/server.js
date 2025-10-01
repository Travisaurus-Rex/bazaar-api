import express from 'express';
import dotenv from "dotenv";
import userRouter from './routes/users';

dotenv.config();

const app = express();
const APP_PORT = process.env.APP_PORT;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('success!');
})

app.use("/user", userRouter);

app.listen(APP_PORT, (err) => {
    if (err) return console.error(err);
    console.log(`listening on port: ${APP_PORT}`);
})

