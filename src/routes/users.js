import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser } from "../models/users";

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

export default router;
