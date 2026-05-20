import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS vessels (
        id VARCHAR(20) PRIMARY KEY,
        name VARCHAR(100),
        status VARCHAR(50),
        status_color VARCHAR(50),
        location VARCHAR(100)
      );
    `;

    await sql`
      INSERT INTO vessels (id, name, status, status_color, location)
      VALUES
      ('19910011', 'NEON HORIZON', 'EN ROUTE', 'text-emerald-500', 'Jakarta Port'),
      ('19910022', 'OCEAN STAR', 'MAINTENANCE', 'text-rose-500', 'Surabaya Port'),
      ('20030033', 'SEA VOYAGER', 'IN PORT', 'text-indigo-500', 'Medan Port'),
      ('20040044', 'ARCTIC GALE', 'EN ROUTE', 'text-emerald-500', 'Balikpapan Port'),
      ('20050055', 'PACIFIC DRIFT', 'ANCHORAGE', 'text-amber-500', 'Palembang Port')
      ON CONFLICT (id) DO NOTHING;
    `;

    return Response.json({
      message: 'Tabel vessels berhasil dibuat!',
    });
  } catch (error) {
    return Response.json({
      error,
    });
  }
}