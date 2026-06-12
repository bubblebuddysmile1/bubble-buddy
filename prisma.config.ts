import dotenv from "dotenv";
import { defineConfig } from "@prisma/config";

dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
const command = process.argv.slice(2).join(" ").toLowerCase();
const isGenerateCommand = command.includes("generate");

if (!databaseUrl && !isGenerateCommand) {
  throw new Error(
    "DATABASE_URL environment variable is required for Prisma commands other than generate. Set it in .env or the process environment."
  );
}

export default defineConfig({
  datasource: {
    url: databaseUrl ?? "mysql://127.0.0.1:3306/bubble_buddy",
  },
  migrations: {
    path: "prisma/migrations",
  },
  schema: "prisma/schema.prisma",
});
