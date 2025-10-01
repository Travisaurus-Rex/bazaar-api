import { ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { dbClient } from "../config/dynamo.js";

const testConnection = async () => {
    try {
        const tables = await dbClient.send(new ListTablesCommand({}));
        console.log('DynamoDB tables: ', tables);
    } catch (err) {
        console.error('Error connecting to DynamoDB: ', err);
    }
}

testConnection();