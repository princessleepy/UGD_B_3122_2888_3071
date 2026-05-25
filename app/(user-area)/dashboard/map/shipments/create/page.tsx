import Link from 'next/link';
import { createShipmentTransaction } from '@/app/lib/actions';

export default function CreateShipmentPage() {
  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Create Shipment
          </h1>

          <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1 uppercase">
            Register new cargo transaction
          </p>
        </div>

        <Link
          href="/dashboard/map/shipments"
          className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
        >
          Back
        </Link>
      </div>

      <form
        action={createShipmentTransaction}
        className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-8"
      >
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Shipment Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Tanggal Kirim" name="shippingDate" type="date" />
            <Select
              label="Jenis Pengiriman"
              name="shippingType"
              options={['Biasa', 'Cepat', 'VVIP']}
            />
            <Select
              label="Status Pengiriman"
              name="shipmentStatus"
              options={['PENDING', 'ON ROUTE', 'ARRIVED', 'DELAYED']}
            />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Sender & Receiver
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nama Pengirim" name="senderName" />
            <Input label="Nama Penerima" name="receiverName" />
            <Input label="No Telepon" name="phoneNumber" />
            <Input label="Kota Asal" name="originCity" />
            <Input label="Kota Tujuan" name="destinationCity" />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Cargo Detail
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nama Barang" name="itemName" />
            <Input label="Jenis Barang" name="itemType" />
            <Input label="Berat Barang (KG)" name="itemWeight" type="number" />
            <Input label="Harga / Tarif" name="price" type="number" />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Vehicle Detail
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Nama Kendaraan" name="vehicleName" />
            <Input label="Jenis Kendaraan" name="vehicleType" />
            <Input label="Plat / Kode Kendaraan" name="vehicleCode" />
            <Input label="Kapasitas Kendaraan" name="vehicleCapacity" />
            <Select
              label="Status Kendaraan"
              name="vehicleStatus"
              options={['ACTIVE', 'IN PORT', 'ANCHORAGE', 'MAINTENANCE']}
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
            Deskripsi / Catatan Barang
          </label>

          <textarea
            name="notes"
            rows={4}
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60"
            placeholder="Tambahkan catatan pengiriman..."
          />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/dashboard/map/shipments"
            className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all"
          >
            Save Shipment
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  type = 'text',
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
        {label}
      </label>

      <input
        required
        name={name}
        type={type}
        className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
        {label}
      </label>

      <select
        required
        name={name}
        className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60"
      >
        <option value="">Select option</option>

        {options.map((option) => (
          <option key={option} value={option} className="bg-[#150e24]">
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}