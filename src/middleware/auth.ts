import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { AuthRequest } from '../types/AuthRequest';

const JWT_SECRET = process.env.JWT_SECRET!;

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer'))
        return res.status(401).json({ error: 'Missing bearer token!'});

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
}