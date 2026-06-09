'use client';

import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateShipmentTransaction, type ActionResponse } from '@/app/lib/actions';
import { Vehicle } from '@/app/lib/definitions';

type ShipmentData = {
  tracking_number: string;
  shipping_date: string;
  sender_name: string;
  receiver_name: string;
  phone_number: string;
  origin_city: string;
  destination_city: string;
  item_name: string;
  item_type: string;
  item_weight: number;
  price: number;
  vehicle_name: string;
  vehicle_type: string;
  vehicle_code: string;
  vehicle_capacity: string;
  vehicle_status: string;
  shipping_type: string;
  shipment_status: string;
  notes: string | null;
};

type AvailableVehicle = Pick<
  Vehicle,
  'vehicle_code' | 'vehicle_name' | 'vehicle_type' | 'capacity' | 'status'
>;

type FormErrors = Record<string, string>;

function mapDbVehicle(v: AvailableVehicle) {
  return {
    name: v.vehicle_name,
    type: v.vehicle_type,
    code: v.vehicle_code,
    capacity: v.capacity,
    status: v.status,
  };
}

export default function EditShipmentForm({
  shipmentId,
  initialData,
  availableVehicles,
}: {
  shipmentId: string;
  initialData: ShipmentData;
  availableVehicles: AvailableVehicle[];
}) {
  const router = useRouter();
  const vehicles = availableVehicles.map(mapDbVehicle);
  const initialCode =
    initialData.vehicle_code ||
    vehicles.find((v) => v.name === initialData.vehicle_name)?.code ||
    vehicles[0]?.code ||
    '';

  const [selectedVehicleCode, setSelectedVehicleCode] = useState(initialCode);
  const [clientErrors, setClientErrors] = useState<FormErrors>({});
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const selectedVehicle =
    vehicles.find((v) => v.code === selectedVehicleCode) ?? {
      name: initialData.vehicle_name,
      type: initialData.vehicle_type,
      code: initialData.vehicle_code,
      capacity: initialData.vehicle_capacity,
      status: initialData.vehicle_status,
    };

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    updateShipmentTransaction,
    { success: false },
  );

  useEffect(() => {
    if (state?.success && state.redirectUrl) {
      router.push(state.redirectUrl);
      router.refresh();
    }
  }, [state, router]);

  function validateForm(formData: FormData): boolean {
    const errors: FormErrors = {};

    if (!String(formData.get('senderName') ?? '').trim()) {
      errors.senderName = 'Sender name is required';
    }
    if (!String(formData.get('receiverName') ?? '').trim()) {
      errors.receiverName = 'Receiver name is required';
    }
    if (!String(formData.get('originCity') ?? '').trim()) {
      errors.originCity = 'Origin city is required';
    }
    if (!String(formData.get('destinationCity') ?? '').trim()) {
      errors.destinationCity = 'Destination city is required';
    }
    if (!selectedVehicleCode) {
      errors.vehicleCode = 'Vehicle must be selected';
    }

    const hasErrors = Object.keys(errors).length > 0;
    setClientErrors(errors);
    setShowErrorAlert(hasErrors);
    return !hasErrors;
  }

  function handleSubmit(formData: FormData) {
    if (!validateForm(formData)) return;
    formAction(formData);
  }

  const fieldError = (field: string, serverField?: string) =>
    clientErrors[field] || serverField;

  return (
    <form
      action={handleSubmit}
      className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-8"
    >
      <input type="hidden" name="id" value={shipmentId} />
      <input type="hidden" name="vehicleName" value={selectedVehicle.name} />
      <input type="hidden" name="vehicleType" value={selectedVehicle.type} />
      <input type="hidden" name="vehicleCode" value={selectedVehicle.code} />
      <input type="hidden" name="vehicleCapacity" value={selectedVehicle.capacity} />
      <input type="hidden" name="vehicleStatus" value={selectedVehicle.status} />

      {(showErrorAlert || state?.error) && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
          <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
            {state?.error
              ? `⚠️ ${state.error}`
              : '⚠️ Please fix the highlighted fields before submitting.'}
          </p>
        </div>
      )}

      <div>
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
          Shipment Identity
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ReadOnlyInput label="Tracking Number" value={initialData.tracking_number} />
          <Input
            label="Shipping Date"
            name="shippingDate"
            type="date"
            defaultValue={String(initialData.shipping_date).slice(0, 10)}
            error={state?.fieldErrors?.shippingDate?.[0]}
            disabled={isPending}
          />
          <Select
            label="Shipping Type"
            name="shippingType"
            options={['Standard', 'Express', 'Priority']}
            defaultValue={initialData.shipping_type}
            error={state?.fieldErrors?.shippingType?.[0]}
            disabled={isPending}
          />
          <Select
            label="Shipment Status"
            name="shipmentStatus"
            options={['PENDING', 'ON ROUTE', 'ARRIVED', 'DELAYED']}
            defaultValue={initialData.shipment_status}
            error={state?.fieldErrors?.shipmentStatus?.[0]}
            disabled={isPending}
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
            defaultValue={initialData.sender_name}
            error={fieldError('senderName', state?.fieldErrors?.senderName?.[0])}
            disabled={isPending}
          />
          <Input
            label="Receiver Name"
            name="receiverName"
            defaultValue={initialData.receiver_name}
            error={fieldError('receiverName', state?.fieldErrors?.receiverName?.[0])}
            disabled={isPending}
          />
          <Input
            label="Phone Number"
            name="phoneNumber"
            defaultValue={initialData.phone_number}
            error={state?.fieldErrors?.phoneNumber?.[0]}
            disabled={isPending}
          />
          <Input
            label="Origin City"
            name="originCity"
            defaultValue={initialData.origin_city}
            error={fieldError('originCity', state?.fieldErrors?.originCity?.[0])}
            disabled={isPending}
          />
          <Input
            label="Destination City"
            name="destinationCity"
            defaultValue={initialData.destination_city}
            error={fieldError(
              'destinationCity',
              state?.fieldErrors?.destinationCity?.[0],
            )}
            disabled={isPending}
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
            defaultValue={initialData.item_name}
            error={state?.fieldErrors?.itemName?.[0]}
            disabled={isPending}
          />
          <Input
            label="Item Type"
            name="itemType"
            defaultValue={initialData.item_type}
            error={state?.fieldErrors?.itemType?.[0]}
            disabled={isPending}
          />
          <Input
            label="Item Weight (KG)"
            name="itemWeight"
            type="number"
            defaultValue={String(initialData.item_weight)}
            error={state?.fieldErrors?.itemWeight?.[0]}
            disabled={isPending}
          />
          <Input
            label="Price / Rate"
            name="price"
            type="number"
            defaultValue={String(initialData.price)}
            error={state?.fieldErrors?.price?.[0]}
            disabled={isPending}
          />
        </div>
      </div>

      <div>
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
          Vehicle Detail
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="vehicle"
              className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3"
            >
              Vehicle / Kapal *
            </label>
            <select
              id="vehicle"
              value={selectedVehicleCode}
              onChange={(e) => {
                setSelectedVehicleCode(e.target.value);
                setClientErrors((prev) => {
                  const next = { ...prev };
                  delete next.vehicleCode;
                  return next;
                });
              }}
              disabled={isPending}
              className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${
                fieldError('vehicleCode', state?.fieldErrors?.vehicleCode?.[0])
                  ? 'border-rose-500'
                  : 'border-white/10'
              }`}
            >
              <option value="">Select Vessel</option>
              {vehicles.map((v) => (
                <option key={v.code} value={v.code} className="bg-[#150e24]">
                  {v.name} ({v.code}) - {v.status}
                </option>
              ))}
            </select>
            {fieldError('vehicleCode', state?.fieldErrors?.vehicleCode?.[0]) && (
              <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
                {fieldError('vehicleCode', state?.fieldErrors?.vehicleCode?.[0])}
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
        <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
          Notes
        </label>
        <textarea
          name="notes"
          rows={4}
          defaultValue={initialData.notes || ''}
          disabled={isPending}
          className="w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50"
          placeholder="Add shipment notes..."
        />
        {state?.fieldErrors?.notes && (
          <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">
            {state.fieldErrors.notes[0]}
          </p>
        )}
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
          disabled={isPending}
          className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Updating...' : 'Update Shipment'}
        </button>
      </div>
    </form>
  );
}

function Input({
  label,
  name,
  type = 'text',
  defaultValue,
  error,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
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
        defaultValue={defaultValue}
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

function Select({
  label,
  name,
  options,
  defaultValue,
  error,
  disabled,
}: {
  label: string;
  name: string;
  options: string[];
  defaultValue?: string;
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
        defaultValue={defaultValue}
        disabled={disabled}
        className={`w-full bg-black/30 border rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60 disabled:opacity-50 ${
          error ? 'border-rose-500' : 'border-white/10'
        }`}
      >
        <option value="">Select option</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#150e24]">
            {option}
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
