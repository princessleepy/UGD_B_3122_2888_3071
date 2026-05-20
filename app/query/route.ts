import postgres from 'postgres';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function getVessels() {
  // Query untuk mengambil semua kolom dari tabel vessels
  const data = await sql`
    SELECT * FROM vessels
    ORDER BY name ASC; 
  `;
  return data;
}

export async function GET() {
  try {
    const vessels = await getVessels();
    
    return Response.json(vessels);
  } catch (error) {
    // Memberikan pesan error yang lebih informatif jika query gagal
    return Response.json(
      { error: 'Failed to fetch vessel data', details: error }, 
      { status: 500 }
    );
  }
}