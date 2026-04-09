import { createClient } from "@libsql/client";
import "dotenv/config";

const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function run() {
    console.log("Conectando ao Turso...");
    
    await libsql.execute(`
        CREATE TABLE IF NOT EXISTS "Link" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "url" TEXT NOT NULL,
            "title" TEXT,
            "clicks" INTEGER NOT NULL DEFAULT 0,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" DATETIME NOT NULL
        );
    `);

    await libsql.execute(`
        CREATE TABLE IF NOT EXISTS "ClickEvent" (
            "id" TEXT NOT NULL PRIMARY KEY,
            "linkId" TEXT NOT NULL,
            "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "ipAddress" TEXT,
            "userAgent" TEXT,
            "country" TEXT,
            "city" TEXT,
            "region" TEXT,
            "referrer" TEXT,
            CONSTRAINT "ClickEvent_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "Link" ("id") ON DELETE CASCADE ON UPDATE CASCADE
        );
    `);

    await libsql.execute(`
        CREATE UNIQUE INDEX IF NOT EXISTS "Link_url_key" ON "Link"("url");
    `);

    console.log("Pronto! As tabelas do Prisma foram criadas no Turso com sucesso!");
}

run().catch(console.error);
