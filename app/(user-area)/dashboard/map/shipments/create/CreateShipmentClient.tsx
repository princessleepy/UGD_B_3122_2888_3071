'use client';

import Link from 'next/link';
import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createShipmentTransaction, type ActionResponse } from '@/app/lib/actions';
import { Vehicle } from '@/app/lib/definitions';

type AvailableVehicle = Pick<
  Vehicle,
  'vehicle_code' | 'vehicle_name' | 'vehicle_type' | 'capacity' | 'status'
>;

function mapDbVehicle(v: AvailableVehicle) {
  return {
    name: v.vehicle_name,
    type: v.vehicle_type,
    code: v.vehicle_code,
    capacity: v.capacity,
    status: v.status,
  };
}

const STORAGE_KEY = 'createShipmentFormData';

type CreateShipmentFormValues = {
  shippingDate: string;
  shippingType: string;
  shipmentStatus: string;
  senderName: string;
  receiverName: string;
  phoneNumber: string;
  originCity: string;
  destinationCity: string;
  itemName: string;
  itemType: string;
  itemWeight: string;
  price: string;
  vehicleName: string;
  vehicleType: string;
  vehicleCode: string;
  vehicleCapacity: string;
  vehicleStatus: string;
  notes: string;
};

function buildInitialFormValues(
  vehicle: ReturnType<typeof mapDbVehicle>,
): CreateShipmentFormValues {
  return {
    shippingDate: '',
    shippingType: '',
    shipmentStatus: '',
    senderName: '',
    receiverName: '',
    phoneNumber: '',
    originCity: '',
    destinationCity: '',
    itemName: '',
    itemType: '',
    itemWeight: '',
    price: '',
    vehicleName: vehicle.name,
    vehicleType: vehicle.type,
    vehicleCode: vehicle.code,
    vehicleCapacity: vehicle.capacity,
    vehicleStatus: vehicle.status,
    notes: '',
  };
}

export default function CreateShipmentClient({
  availableVehicles,
}: {
  availableVehicles: AvailableVehicle[];
}) {
  const router = useRouter();
  const vehicles = availableVehicles.map(mapDbVehicle);
  const defaultVehicle = vehicles[0] ?? {
    name: '',
    type: '',
    code: '',
    capacity: '',
    status: '',
  };

  const [selectedVehicleCode, setSelectedVehicleCode] = useState(
    defaultVehicle.code,
  );
  const selectedVehicle =
    vehicles.find((v) => v.code === selectedVehicleCode) ?? defaultVehicle;
  const [formValues, setFormValues] = useState<CreateShipmentFormValues>(
    buildInitialFormValues(defaultVehicle),
  );

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    createShipmentTransaction,
    { success: false },
  );

  useEffect(() => {
    document.title = 'Create Shipment | PT. Samudra Technology Nusantara';

    const savedValue = window.sessionStorage.getItem(STORAGE_KEY);
    if (savedValue) {
      try {
        const parsed = JSON.parse(savedValue) as CreateShipmentFormValues;
        setFormValues(parsed);
        if (parsed.vehicleCode) {
          setSelectedVehicleCode(parsed.vehicleCode);
        }
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    setFormValues((prev) => ({
      ...prev,
      vehicleName: selectedVehicle.name,
      vehicleType: selectedVehicle.type,
      vehicleCode: selectedVehicle.code,
      vehicleCapacity: selectedVehicle.capacity,
      vehicleStatus: selectedVehicle.status,
    }));
  }, [selectedVehicle]);

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
  }, [formValues]);

  useEffect(() => {
    if (state?.success && state.redirectUrl) {
      window.sessionStorage.removeItem(STORAGE_KEY);
      router.push(state.redirectUrl);
      router.refresh();
    }
  }, [state, router]);

  function handleFieldChange(name: keyof CreateShipmentFormValues, value: string) {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Create Shipment</h1>
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

      <form action={formAction} className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
        {state?.error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
            <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
              ⚠️ {state.error}
            </p>
          </div>
        )}

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Shipment Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Shipping Date" name="shippingDate" type="date" value={formValues.shippingDate} onChange={(v) => handleFieldChange('shippingDate', v)} error={state?.fieldErrors?.shippingDate?.[0]} disabled={isPending} />
            <Select label="Shipping Type" name="shippingType" options={['Standard', 'Express', 'Priority']} value={formValues.shippingType} onChange={(v) => handleFieldChange('shippingType', v)} error={state?.fieldErrors?.shippingType?.[0]} disabled={isPending} />
            <Select label="Shipment Status" name="shipmentStatus" options={['PENDING', 'ON ROUTE', 'ARRIVED', 'DELAYED']} value={formValues.shipmentStatus} onChange={(v) => handleFieldChange('shipmentStatus', v)} error={state?.fieldErrors?.shipmentStatus?.[0]} disabled={isPending} />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Sender & Receiver
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Sender Name" name="senderName" value={formValues.senderName} onChange={(v) => handleFieldChange('senderName', v)} error={state?.fieldErrors?.senderName?.[0]} disabled={isPending} />
            <Input label="Receiver Name" name="receiverName" value={formValues.receiverName} onChange={(v) => handleFieldChange('receiverName', v)} error={state?.fieldErrors?.receiverName?.[0]} disabled={isPending} />
            <Input label="Phone Number" name="phoneNumber" value={formValues.phoneNumber} onChange={(v) => handleFieldChange('phoneNumber', v)} error={state?.fieldErrors?.phoneNumber?.[0]} disabled={isPending} />
            <Input label="Origin City" name="originCity" value={formValues.originCity} onChange={(v) => handleFieldChange('originCity', v)} error={state?.fieldErrors?.originCity?.[0]} disabled={isPending} />
            <Input label="Destination City" name="destinationCity" value={formValues.destinationCity} onChange={(v) => handleFieldChange('destinationCity', v)} error={state?.fieldErrors?.destinationCity?.[0]} disabled={isPending} />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Cargo Detail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Item Name" name="itemName" value={formValues.itemName} onChange={(v) => handleFieldChange('itemName', v)} error={state?.fieldErrors?.itemName?.[0]} disabled={isPending} />
            <Input label="Item Type" name="itemType" value={formValues.itemType} onChange={(v) => handleFieldChange('itemType', v)} error={state?.fieldErrors?.itemType?.[0]} disabled={isPending} />
            <Input label="Item Weight (KG)" name="itemWeight" type="number" value={formValues.itemWeight} onChange={(v) => handleFieldChange('itemWeight', v)} error={state?.fieldErrors?.itemWeight?.[0]} disabled={isPending} />
            <Input label="Price / Rate" name="price" type="number" value={formValues.price} onChange={(v) => handleFieldChange('price', v)} error={state?.fieldErrors?.price?.[0]} disabled={isPending} />
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Vehicle Detail
          </h2>
          <input type="hidden" name="vehicleName" value={selectedVehicle.name} />
          <input type="hidden" name="vehicleType" value={selectedVehicle.type} />
          <input type="hidden" name="vehicleCode" value={selectedVehicle.code} />
          <input type="hidden" name="vehicleCapacity" value={selectedVehicle.capacity} />
          <input type="hidden" name="vehicleStatus" value={selectedVehicle.status} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="vehicle" className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
                Vehicle / Kapal *
              </label>
              <select
                id="vehicle"
                value={selectedVehicleCode}
                onChange={(e) => setSelectedVehicleCode(e.target.value)}
                required
                disabled={isPending || vehicles.length === 0}
                className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${
                  state?.fieldErrors?.vehicleCode ? 'border-rose-500' : 'border-white/10'
                }`}
              >
                <option value="">Select Vessel</option>
                {vehicles.map((v) => (
                  <option key={v.code} value={v.code} className="bg-[#150e24]">
                    {v.name} ({v.code}) - {v.status}
                  </option>
                ))}
              </select>
              {state?.fieldErrors?.vehicleCode && (
                <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
                  {state.fieldErrors.vehicleCode[0]}
                </p>
              )}
            </div>
            <ReadOnlyInput label="Vehicle Type" value={selectedVehicle.type} />
            <ReadOnlyInput label="Vehicle Code" value={selectedVehicle.code} />
            <ReadOnlyInput label="Vehicle Capacity" value={selectedVehicle.capacity} />
            <ReadOnlyInput label="Vehicle Status" value={selectedVehicle.status} />
          </div>
        </div>

        <div>
          <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">Notes</label>
          <textarea name="notes" rows={4} disabled={isPending} value={formValues.notes} onChange={(e) => handleFieldChange('notes', e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50" placeholder="Add shipment notes..." />
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Link href="/dashboard/map/shipments" className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
            Cancel
          </Link>
          <button type="submit" disabled={isPending} className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            {isPending ? 'Saving...' : 'Save Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, name, type = 'text', value, onChange, error, disabled }: { label: string; name: string; type?: string; value?: string; onChange?: (value: string) => void; error?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <input name={name} type={type} value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${error ? 'border-rose-500' : 'border-white/10'}`} />
      {error && <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">{error}</p>}
    </div>
  );
}

function Select({ label, name, options, value, onChange, error, disabled }: { label: string; name: string; options: string[]; value?: string; onChange?: (value: string) => void; error?: string; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <select name={name} value={value} onChange={(e) => onChange?.(e.target.value)} disabled={disabled} className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${error ? 'border-rose-500' : 'border-white/10'}`}>
        <option value="">Select option</option>
        {options.map((opt) => <option key={opt} value={opt} className="bg-[#150e24]">{opt}</option>)}
      </select>
      {error && <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">{error}</p>}
    </div>
  );
}

function ReadOnlyInput({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <div className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white/70">{value}</div>
    </div>
  );
}
