import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// Locks the public schema so only the server can reach the data.
//
// The app talks to Postgres through Prisma as the `postgres` role, which
// bypasses row-level security. Nothing uses Supabase's Data API with the
// public key, so `anon` and `authenticated` need no access at all: RLS is on
// with no policies (deny everything) and their grants are revoked.
//
// Also creates AdminLoginAttempt (see prisma/schema.prisma and
// lib/loginThrottle.ts). Written as a script because `prisma db push` needs
// the schema engine, which can't be downloaded on this machine.
//
// Safe to run more than once. RUN IT AGAIN AFTER ADDING A NEW TABLE, so the
// new table gets row-level security too.
//
//   npx.cmd tsx scripts/secure-database.ts
async function main() {
  const prisma = new PrismaClient();

  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AdminLoginAttempt" (
        "key" TEXT NOT NULL,
        "failures" INTEGER NOT NULL DEFAULT 0,
        "windowStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "AdminLoginAttempt_pkey" PRIMARY KEY ("key")
      )
    `);

    const tables = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
      `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
    );

    for (const { tablename } of tables) {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "public"."${tablename}" ENABLE ROW LEVEL SECURITY`
      );
    }

    for (const statement of [
      "REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated",
      "REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated",
      // Tables created later shouldn't pick these grants back up.
      "ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON TABLES FROM anon, authenticated",
      "ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon, authenticated",
    ]) {
      await prisma.$executeRawUnsafe(statement);
    }

    const open = await prisma.$queryRawUnsafe<{ tablename: string }[]>(
      `SELECT tablename FROM pg_tables
       WHERE schemaname = 'public' AND NOT rowsecurity`
    );
    const grants = await prisma.$queryRawUnsafe<{ count: number }[]>(
      `SELECT COUNT(*)::int AS count FROM information_schema.role_table_grants
       WHERE table_schema = 'public' AND grantee IN ('anon', 'authenticated')`
    );

    console.log(`Tables checked: ${tables.length}`);
    console.log(`Tables without row-level security: ${open.length}`);
    console.log(`Public-role permissions left: ${grants[0].count}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
