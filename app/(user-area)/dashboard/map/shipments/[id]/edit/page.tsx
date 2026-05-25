import Link from 'next/link';

import { fetchShipmentTransactionById } from '@/app/lib/data';
import { updateShipmentTransaction } from '@/app/lib/actions';

const vehicles = [
  {
    name: 'NEON HORIZON',
    type: 'Cargo Vessel',
    code: 'MV-19910011',
    capacity: '14000 MT',
    status: 'ACTIVE',
  },
  {
    name: 'OCEAN STAR',
    type: 'Bulk Carrier',
    code: 'MV-19910022',
    capacity: '62500 MT',
    status: 'MAINTENANCE',
  },
  {
    name: 'SEA VOYAGER',
    type: 'Container Vessel',
    code: 'MV-20030033',
    capacity: '2400 MT',
    status: 'IN PORT',
  },
  {
    name: 'ARCTIC GALE',
    type: 'Cargo Vessel',
    code: 'MV-20040044',
    capacity: '1204 NM',
    status: 'ACTIVE',
  },
  {
    name: 'PACIFIC DRIFT',
    type: 'Tanker Vessel',
    code: 'MV-20050055',
    capacity: '2150 NM',
    status: 'ANCHORAGE',
  },
  {
    name: 'TITAN WAVE',
    type: 'Cargo Vessel',
    code: 'MV-20060066',
    capacity: '3880 NM',
    status: 'ACTIVE',
  },
  {
    name: 'BLACK PEARL',
    type: 'Tanker Vessel',
    code: 'MV-20070077',
    capacity: '2640 NM',
    status: 'ANCHORAGE',
  },
  {
    name: 'STORM CHASER',
    type: 'Container Vessel',
    code: 'MV-20080088',
    capacity: '540 NM',
    status: 'MAINTENANCE',
  },
  {
    name: 'BLUE LEVIATHAN',
    type: 'Chemical Tanker',
    code: 'MV-20090099',
    capacity: '3010 NM',
    status: 'IN PORT',
  },
  {
    name: 'IRON TITAN',
    type: 'Heavy Lift Vessel',
    code: 'MV-20100100',
    capacity: '4620 NM',
    status: 'ACTIVE',
  },
];

export default async function EditShipmentPage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const params = await props.params;
  const shipment = await fetchShipmentTransactionById(params.id);

  const updateShipmentWithId = updateShipmentTransaction.bind(
    null,
    params.id
  );

  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.name === shipment.vehicle_name) ||
    vehicles[0];

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">
            Edit Shipment
          </h1>

          <p className="text-[10px] text-[#bc66ff]/60 font-bold tracking-[0.3em] mt-1 uppercase">
            Update cargo transaction data
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
        action={updateShipmentWithId}
        className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-8"
      >
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Shipment Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReadOnlyInput
              label="Tracking Number"
              value={shipment.tracking_number}
            />

            <Input
              label="Shipping Date"
              name="shippingDate"
              type="date"
              defaultValue={String(shipment.shipping_date).slice(0, 10)}
            />

            <Select
                label="Shipping Type"
                name="shippingType"
                options={['Standard', 'Express', 'Priority']}
                defaultValue={shipment.shipping_type}
            />

            <Select
              label="Shipment Status"
              name="shipmentStatus"
              options={['PENDING', 'ON ROUTE', 'ARRIVED', 'DELAYED']}
              defaultValue={shipment.shipment_status}
            />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Sender & Receiver
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Sender Name"
              name="senderName"
              defaultValue={shipment.sender_name}
            />

            <Input
              label="Receiver Name"
              name="receiverName"
              defaultValue={shipment.receiver_name}
            />

            <Input
              label="Phone Number"
              name="phoneNumber"
              defaultValue={shipment.phone_number}
            />

            <Input
              label="Origin City"
              name="originCity"
              defaultValue={shipment.origin_city}
            />

            <Input
              label="Destination City"
              name="destinationCity"
              defaultValue={shipment.destination_city}
            />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Cargo Detail
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Item Name"
              name="itemName"
              defaultValue={shipment.item_name}
            />

            <Input
              label="Item Type"
              name="itemType"
              defaultValue={shipment.item_type}
            />

            <Input
              label="Item Weight (KG)"
              name="itemWeight"
              type="number"
              defaultValue={String(shipment.item_weight)}
            />

            <Input
              label="Price / Rate"
              name="price"
              type="number"
              defaultValue={String(shipment.price)}
            />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Vehicle Detail
          </h2>

          <input
            type="hidden"
            name="vehicleName"
            value={selectedVehicle.name}
          />
          <input
            type="hidden"
            name="vehicleType"
            value={selectedVehicle.type}
          />
          <input
            type="hidden"
            name="vehicleCode"
            value={selectedVehicle.code}
          />
          <input
            type="hidden"
            name="vehicleCapacity"
            value={selectedVehicle.capacity}
          />
          <input
            type="hidden"
            name="vehicleStatus"
            value={selectedVehicle.status}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ReadOnlyInput
              label="Vehicle Name"
              value={selectedVehicle.name}
            />

            <ReadOnlyInput
              label="Vehicle Type"
              value={selectedVehicle.type}
            />

            <ReadOnlyInput
              label="Vehicle Code"
              value={selectedVehicle.code}
            />

            <ReadOnlyInput
              label="Vehicle Capacity"
              value={selectedVehicle.capacity}
            />

            <ReadOnlyInput
              label="Vehicle Status"
              value={selectedVehicle.status}
            />
          </div>
        </div>

        <div>
          <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
            Notes
          </label>

          <textarea
            name="notes"
            rows={4}
            defaultValue={shipment.notes || ''}
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60"
            placeholder="Add shipment notes..."
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
            Update Shipment
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
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60"
      />
    </div>
  );
}

function Select({
  label,
  name,
  options,
  defaultValue,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
        {label}
      </label>

      <select
        required
        name={name}
        defaultValue={defaultValue}
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

function ReadOnlyInput({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
        {label}
      </label>

      <div className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white/70">
        {value}
      </div>
    </div>
  );
}