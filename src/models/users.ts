import { dbClient } from "../config/dynamo";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import { CreateUserRequest } from "../types/CreateUserRequest";
import { UserLoginRequest } from "../types/UserLoginRequest";

const SALT_ROUNDS = 10;
const JWT_SECRET: string = process.env.JWT_SECRET!;

export const createUser = async ({ name, userId, email, password }: CreateUserRequest) => {
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

export const verifyUserLogin = async ({ userId, password }: UserLoginRequest) => {
    const result = await dbClient.send(new GetCommand({
        TableName: 'Users',
        Key: { userId }
    }));

    const user = result.Item;
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const token = jwt.sign(
        { userId: user.userId, email: user.email },
        JWT_SECRET,
        { expiresIn: '2hr' }
    );

    return { token, user: { ...user, password: undefined }};
}