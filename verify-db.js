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

    // Check row counts
    for (let t of tables) {
      const count = await sql.unsafe(`SELECT COUNT(*) as c FROM "${t.table_name}"`);
      console.log(`  ${t.table_name}: ${count[0].c} rows`);
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}
run();
