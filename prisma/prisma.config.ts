import 'dotenv/config';
import { defineConfig } from "prisma/config";
import { DATABASE_URL } from "../src/constants";

export default defineConfig({
  schema: './schema.prisma',
  migrations: { 
    path: './migrations',
    seed: 'tsx ./seed.ts',
  },
  datasource: { 
    url: DATABASE_URL,
  }
});