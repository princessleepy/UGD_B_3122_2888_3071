
'use client';

import React, { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // ✅ TAMBAHKAN INI!
import { updateShipmentTransaction, type ActionResponse } from '@/app/lib/actions';

// ... kode selanjutnya

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

type Vehicle = {
  name: string;
  type: string;
  code: string;
  capacity: string;
  status: string;
};

type EditShipmentFormValues = {
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
  notes: string;
};

export default function EditShipmentForm({ 
  shipmentId, 
  initialData, 
  selectedVehicle,
  vehicles,
}: { 
  shipmentId: string; 
  initialData: any; 
  selectedVehicle: any; 
  vehicles: any[];
}) {

  console.log("initialData", initialData);
  console.log("selectedVehicle", selectedVehicle);
  
  // 1. Inisialisasi state LANGSUNG dari props. 
  // Tidak perlu useEffect untuk fetch data lagi.
  const [formValues, setFormValues] = useState({
    shippingDate: String(initialData.shipping_date || '').slice(0, 10),
    shippingType: initialData.shipping_type || '',
    shipmentStatus: initialData.shipment_status || '',
    senderName: initialData.sender_name || '',
    receiverName: initialData.receiver_name || '',
    phoneNumber: initialData.phone_number || '',
    originCity: initialData.origin_city || '',
    destinationCity: initialData.destination_city || '',
    itemName: initialData.item_name || '',
    itemType: initialData.item_type || '',
    itemWeight: String(initialData.item_weight || '0'),
    price: String(initialData.price || '0'),
    notes: initialData.notes || '',
    vehicleName: selectedVehicle?.vehicle_name || initialData.vehicle_name || '',
    vehicleType: selectedVehicle?.vehicle_type || initialData.vehicle_type || '',
    vehicleCode: selectedVehicle?.vehicle_code || initialData.vehicle_code || '',
    vehicleCapacity: selectedVehicle?.capacity || initialData.vehicle_capacity || '',
    vehicleStatus: selectedVehicle?.status || initialData.vehicle_status || '',
  });

  const [selectedVehicleCode, setSelectedVehicleCode] = useState(
    initialData.vehicle_code || ''
  );

  const currentSelectedVehicle = vehicles?.find(
    (v) => v.vehicle_code === selectedVehicleCode
  );

  useEffect(() => {
    if (currentSelectedVehicle) {
      setFormValues((prev) => ({
        ...prev,
        vehicleName: currentSelectedVehicle.vehicle_name || '',
        vehicleType: currentSelectedVehicle.vehicle_type || '',
        vehicleCode: currentSelectedVehicle.vehicle_code || '',
        vehicleCapacity: currentSelectedVehicle.capacity || '',
        vehicleStatus: currentSelectedVehicle.status || '',
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        vehicleName: initialData.vehicle_name || '',
        vehicleType: initialData.vehicle_type || '',
        vehicleCode: initialData.vehicle_code || '',
        vehicleCapacity: initialData.vehicle_capacity || '',
        vehicleStatus: initialData.vehicle_status || '',
      }));
    }
  }, [currentSelectedVehicle, initialData]);

  const router = useRouter();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [state, formAction, isPending] = useActionState<ActionResponse, FormData>(
    updateShipmentTransaction,
    { success: false }
  );

  useEffect(() => {
    if (state?.success && state.redirectUrl) {
      router.push(state.redirectUrl);
      router.refresh();
    }
  }, [state, router]);

  useEffect(() => {
    if (state?.success === false && state?.data) {
      setFormValues((prev) => ({
        ...prev,
        ...state.data,
      }));
    }
  }, [state]);

  useEffect(() => {
    if (!isPending) {
      setIsSubmitting(false);
    }
  }, [isPending]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formValues.shippingDate) newErrors.shippingDate = 'Tanggal pengiriman wajib diisi';
    if (!formValues.shippingType) newErrors.shippingType = 'Tipe pengiriman wajib diisi';
    if (!formValues.shipmentStatus) newErrors.shipmentStatus = 'Status pengiriman wajib diisi';

    if (!formValues.senderName) {
      newErrors.senderName = 'Nama pengirim wajib diisi';
    } else if (!/^[a-zA-Z\s]+$/.test(formValues.senderName)) {
      newErrors.senderName = 'Nama pengirim hanya boleh berisi huruf dan spasi';
    }

    if (!formValues.receiverName) {
      newErrors.receiverName = 'Nama penerima wajib diisi';
    } else if (!/^[a-zA-Z\s]+$/.test(formValues.receiverName)) {
      newErrors.receiverName = 'Nama penerima hanya boleh berisi huruf dan spasi';
    }

    if (!formValues.phoneNumber) {
      newErrors.phoneNumber = 'Nomor HP wajib diisi';
    } else if (!/^\d+$/.test(formValues.phoneNumber)) {
      newErrors.phoneNumber = 'Nomor HP harus berupa angka';
    } else if (formValues.phoneNumber.length < 10 || formValues.phoneNumber.length > 13) {
      newErrors.phoneNumber = 'Nomor HP harus berukuran 10 sampai 13 digit';
    }

    if (!formValues.originCity) {
      newErrors.originCity = 'Kota asal wajib diisi';
    } else if (!/^[a-zA-Z\s]+$/.test(formValues.originCity)) {
      newErrors.originCity = 'Kota asal hanya boleh berisi huruf dan spasi';
    }

    if (!formValues.destinationCity) {
      newErrors.destinationCity = 'Kota tujuan wajib diisi';
    } else if (!/^[a-zA-Z\s]+$/.test(formValues.destinationCity)) {
      newErrors.destinationCity = 'Kota tujuan hanya boleh berisi huruf dan spasi';
    }

    if (!formValues.itemName) {
      newErrors.itemName = 'Nama barang wajib diisi';
    } else if (!/^[a-zA-Z\s]+$/.test(formValues.itemName)) {
      newErrors.itemName = 'Nama barang hanya boleh berisi huruf dan spasi';
    }

    if (!formValues.itemType) {
      newErrors.itemType = 'Tipe barang wajib diisi';
    } else if (!/^[a-zA-Z\s]+$/.test(formValues.itemType)) {
      newErrors.itemType = 'Tipe barang hanya boleh berisi huruf dan spasi';
    }

    const weightNum = parseFloat(formValues.itemWeight);
    if (!formValues.itemWeight) {
      newErrors.itemWeight = 'Berat barang wajib diisi';
    } else if (isNaN(weightNum)) {
      newErrors.itemWeight = 'Berat barang harus berupa angka';
    } else if (weightNum < 10) {
      newErrors.itemWeight = 'Berat barang minimal 10 kg';
    }

    const priceNum = parseFloat(formValues.price);
    if (!formValues.price) {
      newErrors.price = 'Harga wajib diisi';
    } else if (isNaN(priceNum)) {
      newErrors.price = 'Harga harus berupa angka';
    } else if (priceNum <= 0) {
      newErrors.price = 'Harga harus lebih besar dari 0';
    }

    if (!selectedVehicleCode) {
      newErrors.vehicleCode = 'Kendaraan/Kapal wajib dipilih';
    }

    if (!formValues.notes || formValues.notes.trim() === '') {
      newErrors.notes = 'Catatan wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      React.startTransition(() => {
        formAction(formData);
      });
    } catch (error) {
      setIsSubmitting(false);
    }
  };

  // Helper untuk update state saat input berubah
  const handleChange = (key: string, value: string) => {
    let filteredValue = value;
    if (['itemWeight', 'price', 'phoneNumber'].includes(key)) {
      filteredValue = value.replace(/[^0-9]/g, '');
    }
    setFormValues(prev => ({ ...prev, [key]: filteredValue }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-8"
    >
      {/* ✅ Hidden input untuk ID */}
      <input type="hidden" name="id" value={shipmentId} />

      {/* ✅ Global Error Alert */}
      {state?.error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
          <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
            ⚠️ {state.error}
          </p>
        </div>
      )}

      {/* ✅ Validation Error Alert */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl">
          <p className="text-[10px] text-[#ff7171] font-black uppercase tracking-[0.2em]">
            ⚠️ Silakan perbaiki kesalahan validasi di bawah ini.
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
            value={formValues.shippingDate}
            onChange={(value) => handleChange('shippingDate', value)}
            error={state?.fieldErrors?.shippingDate?.[0]}
            clientError={errors.shippingDate}
            disabled={isPending || isSubmitting}
          />

          <Select
            label="Shipping Type"
            name="shippingType"
            options={['Standard', 'Express', 'Priority']}
            value={formValues.shippingType}
            onChange={(value) => handleChange('shippingType', value)}
            error={state?.fieldErrors?.shippingType?.[0]}
            clientError={errors.shippingType}
            disabled={isPending || isSubmitting}
          />

          <Select
            label="Shipment Status"
            name="shipmentStatus"
            options={['PENDING', 'ON ROUTE', 'ARRIVED', 'DELAYED']}
            value={formValues.shipmentStatus}
            onChange={(value) => handleChange('shipmentStatus', value)}
            error={state?.fieldErrors?.shipmentStatus?.[0]}
            clientError={errors.shipmentStatus}
            disabled={isPending || isSubmitting}
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
            value={formValues.senderName} 
            onChange={(value) => handleChange('senderName', value)} 
            error={state?.fieldErrors?.senderName?.[0]}
            clientError={errors.senderName}
            disabled={isPending || isSubmitting} 
          />

          <Input 
            label="Receiver Name" 
            name="receiverName" 
            value={formValues.receiverName} 
            onChange={(value) => handleChange('receiverName', value)} 
            error={state?.fieldErrors?.receiverName?.[0]} 
            clientError={errors.receiverName}
            disabled={isPending || isSubmitting} 
          />

          <Input 
            label="Phone Number" 
            name="phoneNumber" 
            value={formValues.phoneNumber} 
            onChange={(value) => handleChange('phoneNumber', value)} 
            error={state?.fieldErrors?.phoneNumber?.[0]} 
            clientError={errors.phoneNumber}
            disabled={isPending || isSubmitting} 
          />

          <Input 
            label="Origin City" 
            name="originCity" 
            value={formValues.originCity} 
            onChange={(value) => handleChange('originCity', value)} 
            error={state?.fieldErrors?.originCity?.[0]} 
            clientError={errors.originCity}
            disabled={isPending || isSubmitting} 
          />

          <Input 
            label="Destination City" 
            name="destinationCity" 
            value={formValues.destinationCity} 
            onChange={(value) => handleChange('destinationCity', value)} 
            error={state?.fieldErrors?.destinationCity?.[0]} 
            clientError={errors.destinationCity}
            disabled={isPending || isSubmitting} 
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
            value={formValues.itemName} 
            onChange={(value) => handleChange('itemName', value)} 
            error={state?.fieldErrors?.itemName?.[0]} 
            clientError={errors.itemName}
            disabled={isPending || isSubmitting} 
          />

          <Input 
            label="Item Type" 
            name="itemType" 
            value={formValues.itemType} 
            onChange={(value) => handleChange('itemType', value)} 
            error={state?.fieldErrors?.itemType?.[0]} 
            clientError={errors.itemType}
            disabled={isPending || isSubmitting} 
          />

          <Input 
            label="Item Weight (KG)" 
            name="itemWeight" 
            type="number" 
            value={formValues.itemWeight} 
            onChange={(value) => handleChange('itemWeight', value)} 
            error={state?.fieldErrors?.itemWeight?.[0]} 
            clientError={errors.itemWeight}
            disabled={isPending || isSubmitting} 
          />

          <Input 
            label="Price / Rate" 
            name="price" 
            type="number" 
            value={formValues.price} 
            onChange={(value) => handleChange('price', value)} 
            error={state?.fieldErrors?.price?.[0]} 
            clientError={errors.price}
            disabled={isPending || isSubmitting} 
          />
        </div>
      </div>

      <div>
        <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">
          Vehicle Detail
        </h2>
        <input type="hidden" name="vehicleId" value={currentSelectedVehicle?.id || selectedVehicle?.id || ''} />
        <input type="hidden" name="vehicleName" value={formValues.vehicleName} />
        <input type="hidden" name="vehicleType" value={formValues.vehicleType} />
        <input type="hidden" name="vehicleCode" value={formValues.vehicleCode} />
        <input type="hidden" name="vehicleCapacity" value={formValues.vehicleCapacity} />
        <input type="hidden" name="vehicleStatus" value={formValues.vehicleStatus} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">
              Select Vehicle / Kapal *
            </label>
            <select
              value={selectedVehicleCode}
              onChange={(e) => {
                setSelectedVehicleCode(e.target.value);
                setErrors(prev => ({ ...prev, vehicleCode: '' }));
              }}
              disabled={isPending || isSubmitting || !vehicles || vehicles.length === 0}
              className={`w-full bg-black/30 border ${
                errors.vehicleCode ? 'border-red-500' : 'border-white/10'
              } rounded-2xl px-5 py-4 text-sm outline-none ${
                errors.vehicleCode ? 'focus:border-red-500' : 'focus:border-[#bc66ff]/60'
              } disabled:opacity-50`}
            >
              <option value="">Select Vessel</option>
              {vehicles?.map((v: any) => (
                <option key={v.vehicle_code} value={v.vehicle_code} className="bg-[#150e24]">
                  {v.vehicle_name} ({v.vehicle_code}) - {v.status}
                </option>
              ))}
            </select>
            {errors.vehicleCode && (
              <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mt-2">
                {errors.vehicleCode}
              </p>
            )}
          </div>

          <ReadOnlyInput
            label="Vehicle Name"
            value={formValues.vehicleName}
          />

          <ReadOnlyInput
            label="Vehicle Type"
            value={formValues.vehicleType}
          />

          <ReadOnlyInput
            label="Vehicle Code"
            value={formValues.vehicleCode}
          />

          <ReadOnlyInput
            label="Vehicle Capacity"
            value={formValues.vehicleCapacity}
          />

          <ReadOnlyInput
            label="Vehicle Status"
            value={formValues.vehicleStatus}
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
          value={formValues.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          disabled={isPending || isSubmitting}
          className={`w-full bg-black/30 border ${
            errors.notes || state.fieldErrors?.notes?.[0] ? 'border-red-500' : 'border-white/10'
          } rounded-2xl px-5 py-4 text-sm outline-none ${
            errors.notes || state.fieldErrors?.notes?.[0] ? 'focus:border-red-500' : 'focus:border-[#bc66ff]/60'
          } disabled:opacity-50`}
          placeholder="Add shipment notes..."
        />
        {errors.notes && (
          <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mt-2">
            {errors.notes}
          </p>
        )}
        {!errors.notes && state.fieldErrors?.notes?.[0] && (
          <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mt-2">
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
          disabled={isPending || isSubmitting}
          className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending || isSubmitting ? 'Updating...' : 'Update Shipment'}
        </button>
      </div>
    </form>
  );
}

// ✅ Komponen Input dengan error & disabled
function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  clientError,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  clientError?: string;
  disabled?: boolean;
}) {
  const hasError = !!(error || clientError);
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
        className={`w-full bg-black/30 border ${
          hasError ? 'border-red-500' : 'border-white/10'
        } rounded-2xl px-5 py-4 text-sm outline-none ${
          hasError ? 'focus:border-red-500' : 'focus:border-[#bc66ff]/60'
        } disabled:opacity-50`}
      />
      {clientError && (
        <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mt-2">
          {clientError}
        </p>
      )}
      {!clientError && error && (
        <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

// ✅ Komponen Select dengan error & disabled
function Select({
  label,
  name,
  options,
  value,
  onChange,
  error,
  clientError,
  disabled,
}: {
  label: string;
  name: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  clientError?: string;
  disabled?: boolean;
}) {
  const hasError = !!(error || clientError);
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
        className={`w-full bg-black/30 border ${
          hasError ? 'border-red-500' : 'border-white/10'
        } rounded-2xl px-5 py-4 text-sm outline-none ${
          hasError ? 'focus:border-red-500' : 'focus:border-[#bc66ff]/60'
        } disabled:opacity-50`}
      >
        <option value="">Select option</option>
        {options.map((option) => (
          <option key={option} value={option} className="bg-[#150e24]">
            {option}
          </option>
        ))}
      </select>
      {clientError && (
        <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mt-2">
          {clientError}
        </p>
      )}
      {!clientError && error && (
        <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mt-2">
          {error}
        </p>
      )}
    </div>
  );
}

// ✅ ReadOnlyInput (tanpa perubahan)
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
