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
  max: 1,           // Neon free tier: keep connections minimal
  idle_timeout: 20,
  connect_timeout: 15,
  prepare: !isPooler, // Must be false for PgBouncer/pooler
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = sql;
