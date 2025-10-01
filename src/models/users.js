import { dbClient } from "../config/dynamo.js";
import { PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

export const createUser = async ({name, userId, email, password}) => {
    const user = { name, userId, email, password, createdAt: new Date().toISOString()};
    try {
        await dbClient.send(new PutCommand({
            TableName: 'Users',
            Item: user
        }));
        return user;
    } catch (err) {
        console.error(err);
        throw err;
    }
}