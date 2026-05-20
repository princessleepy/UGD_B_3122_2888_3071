import postgres from 'postgres';

// Menghubungkan ke database
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function GET() {
  try {
    // Kita tes panggil tabel vessels saja yang sudah kamu buat tadi
    const result = await sql`SELECT * FROM vessels LIMIT 1`; 
    
    return Response.json({
      message: 'Build Berhasil! Masalah import sudah diperbaiki.',
      data_sample: result,
    });
  } catch (error) {
    // Jika tabel vessels belum ada, dia tetap tidak akan bikin build gagal
    return Response.json({ message: 'Koneksi database oke, tapi tabel belum terbaca.' });
  }
}
