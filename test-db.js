const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

// Parse .env file
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/(^['"]|['"]$)/g, '');
    env[key] = value;
  }
});

const connectionString = env.DATABASE_URL_UNPOOLED || env.POSTGRES_URL || env.DATABASE_URL;
if (!connectionString) {
  console.error("No connection string found!");
  process.exit(1);
}

const sql = postgres(connectionString, { ssl: 'require' });

async function run() {
  try {
    console.log("Connecting to:", connectionString.split('@')[1] || connectionString);
    
    // Check tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("Tables:", tables.map(t => t.table_name));

    // Check port_operators
    if (tables.some(t => t.table_name === 'port_operators')) {
      const ops = await sql`SELECT * FROM port_operators`;
      console.log("Port Operators:");
      console.log(ops);
    }

    // Check vehicles
    if (tables.some(t => t.table_name === 'vehicles')) {
      const count = await sql`SELECT count(*)::int as count FROM vehicles`;
      console.log("Total Vehicles:", count[0].count);
      const statuses = await sql`SELECT status, count(*)::int as count FROM vehicles GROUP BY status`;
      console.log("Vehicle Statuses:", statuses);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await sql.end();
  }
}

run();
