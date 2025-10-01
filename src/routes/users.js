import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, verifyUserLogin } from "../models/users";

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // for dev/testing

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

export default router;
