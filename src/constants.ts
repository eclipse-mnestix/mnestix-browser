import path from "path";

const dbPath = path.join(process.cwd(), 'prisma', 'database', 'mnestix-database.db');
export const DATABASE_URL = `file:${dbPath}`;