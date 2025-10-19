import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { mongoDb } from './db.js';

export const auth = betterAuth({
    database: mongodbAdapter(mongoDb, {
        usePlural: true,
    }),
    advanced: {
        defaultCookieAttributes: {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        }
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    trustedOrigins: ["*"],
    user: {
        additionalFields: {
            numberOfQuestions: {
                type: "number",
                input: false,
                defaultValue: 10
            },
            difficulty: {
                type: "string",
                input: true,
                defaultValue: "easy"
            }
        }
    }

});

export type AuthType = typeof auth;