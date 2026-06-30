import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";


const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },
    database: mongodbAdapter(db, {
        // Optional: if you don't provide a client, database transactions won't be enabled.
        client,
    }),
    user: {
        additionalFields: {
            role: { type: "string", default: "user" },
            onboardingCompleted: { type: "boolean", default: false },
            plan: { type: "string", default: "free" }
        },
    },

    //  DATABASE HOOK 
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // This injects the defaults into MongoDB right before saving
                    return {
                        data: {
                            ...user,
                            plan: user.plan || "free",
                            role: user.role || "user",
                            onboardingCompleted: user.onboardingCompleted || false
                        }
                    };
                }
            }
        }
    },
    // plugins: [
    //     admin(),
    // ],
    session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            maxAge: 60 * 24 * 60 * 60
        }
    },
    plugins: [
        admin(),
        jwt(),
    ],
});