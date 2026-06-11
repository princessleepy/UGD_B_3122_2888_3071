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

/**
 * Safely remove the `channel_binding` parameter from the Neon connection URL.
 * The URL API is used to avoid broken query strings (e.g., when channel_binding
 * is the first param: "?channel_binding=x&sslmode=require" → naive regex would
 * produce "&sslmode=require" without a leading "?" which postgres.js then
 * incorrectly includes in the database name).
 */
function cleanConnectionUrl(rawUrl: string): string {
  try {
    // postgres:// is not a recognized protocol by the URL constructor, swap it temporarily
    const normalized = rawUrl.replace(/^postgres(ql)?:\/\//, 'https://');
    const url = new URL(normalized);
    url.searchParams.delete('channel_binding');
    // Restore original protocol
    return url.toString().replace(/^https:\/\//, rawUrl.match(/^(postgres(?:ql)?):\/\//)?.[1] === 'postgresql' ? 'postgresql://' : 'postgres://');
  } catch {
    // Fallback: regex strip — fix dangling & after removal
    return rawUrl
      .replace(/[?&]channel_binding=[^&]*/g, '')
      .replace(/\?$/, '')
      .replace(/\?&/, '?')   // fix: "?&remaining" → "?remaining"
      .replace(/&&/g, '&');  // fix: "&&" → "&"
  }
}

const connectionString = cleanConnectionUrl(rawUrl);

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
