import postgres from 'postgres';

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

// Prioritize unpooled connection URL since pooler/PgBouncer connections have been timing out
const connectionString = 
  process.env.DATABASE_URL_UNPOOLED || 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('Database connection string is not defined in environment variables');
}

// If we are forced to fallback to a pooler endpoint (which contains '-pooler'), disable prepared statements
const isPooler = connectionString.includes('-pooler');

export const sql = globalForDb.conn ?? postgres(connectionString, {
  ssl: 'require',
  max: 1, // Set max connection pool size to 1 to prevent Neon free tier connection exhaustion!
  idle_timeout: 10,
  connect_timeout: 5,
  prepare: !isPooler, // Disable prepared statements when using PgBouncer/pooler
});

if (process.env.NODE_ENV !== 'production') globalForDb.conn = sql;
