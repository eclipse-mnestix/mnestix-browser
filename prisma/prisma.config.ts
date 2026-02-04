import 'dotenv/config';
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: './schema.prisma',
  migrations: { 
    path: './migrations',
    seed: 'tsx ./seed.ts',
  },
  datasource: { 
    url: 'file:./database/mnestix-database.db',
  }
});