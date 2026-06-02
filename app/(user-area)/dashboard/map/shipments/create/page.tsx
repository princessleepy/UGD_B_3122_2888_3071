'use client';

import Link from 'next/link';
import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createShipmentTransaction, type ActionResponse } from '@/app/lib/actions';

const vehicles = [
  { name: 'NEON HORIZON', type: 'Cargo Vessel', code: 'MV-19910011', capacity: '14000 MT', status: 'ACTIVE' },
  { name: 'OCEAN STAR', type: 'Bulk Carrier', code: 'MV-19910022', capacity: '62500 MT', status: 'MAINTENANCE' },
  { name: 'SEA VOYAGER', type: 'Container Vessel', code: 'MV-20030033', capacity: '2400 MT', status: 'IN PORT' },
  { name: 'ARCTIC GALE', type: 'Cargo Vessel', code: 'MV-20040044', capacity: '1204 NM', status: 'ACTIVE' },
  { name: 'PACIFIC DRIFT', type: 'Tanker Vessel', code: 'MV-20050055', capacity: '2150 NM', status: 'ANCHORAGE' },
  { name: 'TITAN WAVE', type: 'Cargo Vessel', code: 'MV-20060066', capacity: '3880 NM', status: 'ACTIVE' },
  { name: 'BLACK PEARL', type: 'Tanker Vessel', code: 'MV-20070077', capacity: '2640 NM', status: 'ANCHORAGE' },
  { name: 'STORM CHASER', type: 'Container Vessel', code: 'MV-20080088', capacity: '540 NM', status: 'MAINTENANCE' },
  { name: 'BLUE LEVIATHAN', type: 'Chemical Tanker', code: 'MV-20090099', capacity: '3010 NM', status: 'IN PORT' },
  { name: 'IRON TITAN', type: 'Heavy Lift Vessel', code: 'MV-20100100', capacity: '4620 NM', status: 'ACTIVE' },
];

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

const initialFormValues: CreateShipmentFormValues = {
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
  vehicleName: vehicles[0].name,
  vehicleType: vehicles[0].type,
  vehicleCode: vehicles[0].code,
  vehicleCapacity: vehicles[0].capacity,
  vehicleStatus: vehicles[0].status,
  notes: '',
};

export default function CreateShipmentPage() {
  const router = useRouter();
  
  const [selectedVehicleName, setSelectedVehicleName] = useState(vehicles[0].name);
  const selectedVehicle = vehicles.find((v) => v.name === selectedVehicleName) || vehicles[0];
  const [formValues, setFormValues] = useState<CreateShipmentFormValues>(initialFormValues);

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    createShipmentTransaction,
    { success: false }
  );

  useEffect(() => {
    document.title = 'Create Shipment | PT. Samudra Technology Nusantara';

    const savedValue = window.sessionStorage.getItem(STORAGE_KEY);
    if (savedValue) {
      try {
        const parsed = JSON.parse(savedValue) as CreateShipmentFormValues;
        setFormValues(parsed);
        if (parsed.vehicleName) {
          setSelectedVehicleName(parsed.vehicleName);
        }
      } catch {
        window.sessionStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const payload = {
      ...formValues,
      vehicleName: selectedVehicle.name,
      vehicleType: selectedVehicle.type,
      vehicleCode: selectedVehicle.code,
      vehicleCapacity: selectedVehicle.capacity,
      vehicleStatus: selectedVehicle.status,
    };

    setFormValues(payload);
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
  }, [state, router, formValues]);

  function handleFieldChange(name: keyof CreateShipmentFormValues, value: string) {
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
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
        {/* ✅ GLOBAL ERROR ALERT */}
        {state?.error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
            <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
              ⚠️ {state.error}
            </p>
          </div>
        )}

        {/* ==================== SHIPMENT IDENTITY ==================== */}
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Shipment Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Shipping Date" 
              name="shippingDate" 
              type="date" 
              value={formValues.shippingDate}
              onChange={(value) => handleFieldChange('shippingDate', value)}
              error={state?.fieldErrors?.shippingDate?.[0]} 
              disabled={isPending} 
            />
            <Select 
              label="Shipping Type" 
              name="shippingType" 
              options={['Standard', 'Express', 'Priority']} 
              value={formValues.shippingType}
              onChange={(value) => handleFieldChange('shippingType', value)}
              error={state?.fieldErrors?.shippingType?.[0]} 
              disabled={isPending} 
            />
            <Select 
              label="Shipment Status" 
              name="shipmentStatus" 
              options={['PENDING', 'ON ROUTE', 'ARRIVED', 'DELAYED']} 
              value={formValues.shipmentStatus}
              onChange={(value) => handleFieldChange('shipmentStatus', value)}
              error={state?.fieldErrors?.shipmentStatus?.[0]} 
              disabled={isPending} 
            />
          </div>
        </div>

        {/* ==================== SENDER & RECEIVER ==================== */}
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Sender & Receiver
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Sender Name" 
              name="senderName" 
              value={formValues.senderName}
              onChange={(value) => handleFieldChange('senderName', value)}
              error={state?.fieldErrors?.senderName?.[0]} 
              disabled={isPending} 
            />
            <Input 
              label="Receiver Name" 
              name="receiverName" 
              value={formValues.receiverName}
              onChange={(value) => handleFieldChange('receiverName', value)}
              error={state?.fieldErrors?.receiverName?.[0]} 
              disabled={isPending} 
            />
            <Input 
              label="Phone Number" 
              name="phoneNumber" 
              value={formValues.phoneNumber}
              onChange={(value) => handleFieldChange('phoneNumber', value)}
              error={state?.fieldErrors?.phoneNumber?.[0]} 
              disabled={isPending} 
            />
            <Input 
              label="Origin City" 
              name="originCity" 
              value={formValues.originCity}
              onChange={(value) => handleFieldChange('originCity', value)}
              error={state?.fieldErrors?.originCity?.[0]} 
              disabled={isPending} 
            />
            <Input 
              label="Destination City" 
              name="destinationCity" 
              value={formValues.destinationCity}
              onChange={(value) => handleFieldChange('destinationCity', value)}
              error={state?.fieldErrors?.destinationCity?.[0]} 
              disabled={isPending} 
            />
          </div>
        </div>

        {/* ==================== CARGO DETAIL ==================== */}
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
            Cargo Detail
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input 
              label="Item Name" 
              name="itemName" 
              value={formValues.itemName}
              onChange={(value) => handleFieldChange('itemName', value)}
              error={state?.fieldErrors?.itemName?.[0]} 
              disabled={isPending} 
            />
            <Input 
              label="Item Type" 
              name="itemType" 
              value={formValues.itemType}
              onChange={(value) => handleFieldChange('itemType', value)}
              error={state?.fieldErrors?.itemType?.[0]} 
              disabled={isPending} 
            />
            <Input 
              label="Item Weight (KG)" 
              name="itemWeight" 
              type="number" 
              value={formValues.itemWeight}
              onChange={(value) => handleFieldChange('itemWeight', value)}
              error={state?.fieldErrors?.itemWeight?.[0]} 
              disabled={isPending} 
            />
            <Input 
              label="Price / Rate" 
              name="price" 
              type="number" 
              value={formValues.price}
              onChange={(value) => handleFieldChange('price', value)}
              error={state?.fieldErrors?.price?.[0]} 
              disabled={isPending} 
            />
          </div>
        </div>

        {/* ==================== VEHICLE DETAIL ==================== */}
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
              <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
                Vehicle Name
              </label>
              <select
                value={selectedVehicleName}
                onChange={(e) => setSelectedVehicleName(e.target.value)}
                disabled={isPending}
                className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50"
              >
                {vehicles.map((v) => (
                  <option key={v.name} value={v.name} className="bg-[#150e24]">
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
            <ReadOnlyInput label="Vehicle Type" value={selectedVehicle.type} />
            <ReadOnlyInput label="Vehicle Code" value={selectedVehicle.code} />
            <ReadOnlyInput label="Vehicle Capacity" value={selectedVehicle.capacity} />
            <ReadOnlyInput label="Vehicle Status" value={selectedVehicle.status} />
          </div>
        </div>

        {/* ==================== NOTES ==================== */}
        <div>
          <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
            Notes
          </label>
          <textarea
            name="notes"
            rows={4}
            disabled={isPending}
            value={formValues.notes}
            onChange={(e) => handleFieldChange('notes', e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50"
            placeholder="Add shipment notes..."
          />
          {state?.fieldErrors?.notes && (
            <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
              {state.fieldErrors.notes[0]}
            </p>
          )}
        </div>

        {/* ==================== BUTTONS ==================== */}
        <div className="flex justify-end gap-4 pt-4">
          <Link
            href="/dashboard/map/shipments"
            className="bg-white/5 border border-white/10 px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all disabled:opacity-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Saving...' : 'Save Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==================== INPUT COMPONENT WITH ERROR HANDLING ====================
function Input({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  disabled 
}: { 
  label: string; 
  name: string; 
  type?: string; 
  value?: string;
  onChange?: (value: string) => void;
  error?: string; 
  disabled?: boolean; 
}) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10'
        }`}
      />
      {error && (
        <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

// ==================== SELECT COMPONENT WITH ERROR HANDLING ====================
function Select({ 
  label, 
  name, 
  options, 
  value, 
  onChange, 
  error, 
  disabled 
}: { 
  label: string; 
  name: string; 
  options: string[]; 
  value?: string;
  onChange?: (value: string) => void;
  error?: string; 
  disabled?: boolean; 
}) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10'
        }`}
      >
        <option value="">Select option</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[#150e24]">
            {opt}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

// ==================== READ-ONLY INPUT COMPONENT ====================
function ReadOnlyInput({ label, value }: { label: string; value: string }) {
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