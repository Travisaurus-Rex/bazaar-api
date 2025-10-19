import express, { NextFunction, Request, Response } from "express";
import { createUser, verifyUserLogin } from "../models/users";
import { authMiddleware } from '../middleware/auth';
import { AuthRequest } from "../types/AuthRequest";

const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch(err) {
        next(err);
    }
})

router.post('/login', async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { userId, password } = req.body;
        const user = await verifyUserLogin({ userId, password })
        if (!user) res.status(500).json({ error: 'Invalid login credentials' });
        res.json(user);
    } catch(err) {
        next(err);
    }
})

router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
    res.status(200).json({ message: 'user is authenticated', user: req.user })
})

export default router;
