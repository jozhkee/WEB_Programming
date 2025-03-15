import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

// Export the database connection
export const db = drizzle(process.env.DATABASE_URL!);
