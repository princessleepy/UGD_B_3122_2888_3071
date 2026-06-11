import postgres from 'postgres';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env', 'utf8');
const envVars = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  envVars[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
}

const urls = {
  'POSTGRES_URL (pooler)':         envVars.POSTGRES_URL,
  'DATABASE_URL (pooler)':         envVars.DATABASE_URL,
  'POSTGRES_URL_NON_POOLING':      envVars.POSTGRES_URL_NON_POOLING,
  'DATABASE_URL_UNPOOLED':         envVars.DATABASE_URL_UNPOOLED,
};

console.log('=== ENV VARS FOUND ===');
for (const [k, v] of Object.entries(urls)) {
  console.log(`${k}: ${v ? v.replace(/:[^:@]+@/, ':***@') : 'NOT SET'}`);
}

async function testConnection(label, url) {
  if (!url) { console.log(`\n[SKIP] ${label} — not set`); return false; }
  const isPooler = url.includes('-pooler');
  const clean = url.replace(/[?&]channel_binding=[^&]*/g, '').replace(/\?$/, '');
  console.log(`\n[TEST] ${label}`);
  console.log(`  isPooler: ${isPooler}`);
  try {
    const sql = postgres(clean, {
      ssl: 'require',
      max: 1,
      connect_timeout: 15,
      prepare: !isPooler,
    });
    const r = await sql`SELECT COUNT(*) AS cnt FROM vehicles`;
    console.log(`  ✅ SUCCESS — vehicles count: ${r[0].cnt}`);
    await sql.end();
    return true;
  } catch (e) {
    console.log(`  ❌ FAILED: ${e.message} (code: ${e.code ?? 'n/a'})`);
    return false;
  }
}

await testConnection('POSTGRES_URL (pooler)',    envVars.POSTGRES_URL);
await testConnection('DATABASE_URL (pooler)',    envVars.DATABASE_URL);
await testConnection('POSTGRES_URL_NON_POOLING', envVars.POSTGRES_URL_NON_POOLING);
await testConnection('DATABASE_URL_UNPOOLED',    envVars.DATABASE_URL_UNPOOLED);
