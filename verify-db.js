const postgres = require('postgres');
const sql = postgres('postgresql://neondb_owner:npg_RGdIrU8ifAO5@ep-dawn-sun-anyumldc-pooler.c-6.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require', { ssl: 'require' });

async function run() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;
    console.log('Tables in NEW database:', tables.map(t => t.table_name));

    const operators = await sql`SELECT * FROM port_operators LIMIT 1`;
    console.log('port_operators row:', operators[0]);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}
run();