import { dbClient } from "../config/dynamo.js";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

export const createUser = async ({name, userId, email, password}) => {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = { 
        name, 
        userId, 
        email, 
        password: hashedPassword, 
        createdAt: new Date().toISOString()
    };

    try {
        await dbClient.send(new PutCommand({
            TableName: 'Users',
            Item: user
        }));

        return { ...user, password: undefined };
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const verifyUserLogin = async ({ userId, password }) => {
    const result = await dbClient.send(new GetCommand({
        TableName: 'Users',
        Key: { userId }
    }));

    const user = result.Item;
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { userId, email } = user;
    const token = jwt.sign(
        { userId, email },
        JWT_SECRET,
        { expiresIn: '2hr' }
    );

    return { token, user: { ...user, password: undefined }};
}