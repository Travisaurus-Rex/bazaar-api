import { User } from "@prisma/client";

export interface LoggedInUser extends User {
    access_token: string;
}