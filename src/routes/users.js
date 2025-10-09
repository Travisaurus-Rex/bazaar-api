import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, verifyUserLogin } from "../models/users";
import { authMiddleware } from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/", async (req, res) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch(err) {
        res.status(500).json({ error: err.message})
    }
})

router.post("/login", async (req, res) => {
    try {
        const { userId, password } = req.body;
        const user = await verifyUserLogin({ userId, password })
        if (!user) res.status(500).json({ error: 'Invalid login credentials' });
        res.json(user);
    } catch(err) {
        res.status(500).json({ error: err.message })
    }
})

router.get('/me', authMiddleware, async (req, req) => {
    req.status(200).json({ message: 'user is authenticated', user: req.user })
})

export default router;
