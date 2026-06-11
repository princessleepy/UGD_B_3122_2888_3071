import postgres from 'postgres';

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Use pooler URL — direct/unpooled connections time out on this network (port 5432 blocked)
const rawUrl =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!rawUrl) {
  throw new Error('Database connection string is not defined in environment variables');
}

// Strip channel_binding — not supported by postgres.js driver
const connectionString = rawUrl.replace(/[?&]channel_binding=[^&]*/g, '').replace(/\?$/, '');

// Pooler endpoints use PgBouncer — disable prepared statements to avoid protocol errors
const isPooler = connectionString.includes('-pooler');

export const sql = globalForDb.conn ?? postgres(connectionString, {
  ssl: 'require',
  max: 3,           // Allow a few connections for concurrent requests
  idle_timeout: 30,
  connect_timeout: 30,
  prepare: !isPooler, // Must be false for PgBouncer/pooler
});

// Cache connection globally in ALL environments to avoid exhausting connections on Vercel
globalForDb.conn = sql;
