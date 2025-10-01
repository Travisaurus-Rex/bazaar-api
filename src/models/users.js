import { dbClient } from "../config/dynamo.js";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

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