'use client';

import React from 'react';
import Link from 'next/link';
import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getVehiclesAction, type ActionResponse } from '@/app/lib/actions';
import { createShipment } from '@/app/actions/shipmentActions';

// Tipe ini harus sesuai dengan data yang benar-benar dikirim database Anda
interface Vehicle {
  id: string | number;
  vehicle_name: string;
  vehicle_type: string;
  vehicle_code: string;
  vehicle_capacity: string;
  vehicle_status: string;
}

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
  shipmentStatus: 'ON ROUTE',
  senderName: '',
  receiverName: '',
  phoneNumber: '',
  originCity: '',
  destinationCity: '',
  itemName: '',
  itemType: '',
  itemWeight: '',
  price: '',
  vehicleName: '',
  vehicleType: '',
  vehicleCode: '',
  vehicleCapacity: '',
  vehicleStatus: '',
  notes: '',
};

export default function CreateShipmentPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  
  const router = useRouter();
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [formValues, setFormValues] = useState<CreateShipmentFormValues>(initialFormValues);
  
  // NEW STATES FOR VALIDATION
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [state, formAction, isPending] = useActionState<any, FormData>(
    createShipment,
    { success: false }
  );

  const selectedVehicle = vehicles?.find((v: Vehicle) => v.id.toString() === selectedVehicleId.toString());
  const vehicleDisplay = selectedVehicle || { 
  vehicle_type: '-', 
  vehicle_code: '-', 
  vehicle_capacity: '-', 
  vehicle_status: '-' 
};

useEffect(() => {
  async function loadData() {
    const rawData = await getVehiclesAction();
    console.log("Data mentah dari DB:", rawData); // CEK INI DI KONSOL BROWSER
    
    const formattedData: Vehicle[] = (Array.isArray(rawData) ? rawData : []).map((v: any) => ({
      id: v.id ?? '',
      vehicle_name: v.vehicle_name ?? '',
      vehicle_type: v.vehicle_type ?? 'Tipe Tidak Ditemukan', // Ganti '-' agar tahu jika ini yang muncul
      vehicle_code: v.vehicle_code ?? 'Kode Tidak Ditemukan',
      vehicle_capacity: v.vehicle_capacity ?? 'Kapasitas Tidak Ditemukan',
      vehicle_status: v.vehicle_status ?? 'Status Tidak Ditemukan',
    }));
    setVehicles(formattedData);
  }
  loadData();
}, []);

useEffect(() => {
  if (state?.success === false && state?.data) {
    setFormValues((prev) => ({
      ...prev,
      ...state.data, // Ini akan mengisi kembali field yang ter-reset
    }));
  }
}, [state]);

useEffect(() => {
  if (selectedVehicle) {
    setFormValues(prev => ({
      ...prev,
      vehicleType: selectedVehicle.vehicle_type,
      vehicleCode: selectedVehicle.vehicle_code,
      vehicleCapacity: selectedVehicle.vehicle_capacity,
      vehicleStatus: selectedVehicle.vehicle_status,
    }));
  } else {
    // Reset ke string kosong agar tidak ada "-" jika tidak dipilih
    setFormValues(prev => ({
      ...prev,
      vehicleType: '',
      vehicleCode: '',
      vehicleCapacity: '',
      vehicleStatus: '',
    }));
  }
}, [selectedVehicle]);

useEffect(() => {
  // Hitung otomatis jika ada perubahan berat atau tipe pengiriman
  if (parseFloat(formValues.itemWeight) > 0) {
    const newPrice = calculatePrice(formValues.itemWeight, formValues.shippingType);
    
    // Hanya update jika harga berubah untuk mencegah render berulang
    if (formValues.price !== newPrice) {
      setFormValues(prev => ({ ...prev, price: newPrice }));
    }
  }
}, [formValues.itemWeight, formValues.shippingType]);

useEffect(() => {
  if (state?.success) {
    setSuccessMessage('Shipment berhasil dibuat!');
    const timer = setTimeout(() => {
      router.push('/dashboard/map/shipments');
      router.refresh();
    }, 1500);
    return () => clearTimeout(timer);
  } else if (!isPending) {
    setIsSubmitting(false);
  }
}, [state, isPending, router]);

const validateForm = () => {
  const newErrors: Record<string, string> = {};

  if (!formValues.shippingDate) newErrors.shippingDate = 'Tanggal pengiriman wajib diisi';
  if (!formValues.shippingType) newErrors.shippingType = 'Tipe pengiriman wajib diisi';
  
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

  if (!selectedVehicleId) newErrors.vehicleId = 'Kendaraan/Kapal wajib dipilih';

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

  function handleFieldChange(name: keyof CreateShipmentFormValues, value: string) {
    if (['itemWeight', 'price', 'phoneNumber'].includes(name)) {
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormValues((prev) => ({ ...prev, [name]: numericValue }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  }

  const calculatePrice = (weight: string, type: string) => {
  const numericWeight = parseFloat(weight) || 0;
  const rates: Record<string, number> = { 
    'STANDARD': 1000, 
    'EXPRESS': 2000, 
    'REGULAR': 1500 
  };
  const rate = rates[type] || 1000;
  return (numericWeight * rate).toString();
};

  return (
    <div className="min-h-screen bg-[#0a0514] text-white font-mono p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter">Create Shipment</h1>
        </div>
        <Link href="/dashboard/map/shipments" className="bg-white/5 border border-white/10 px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Back</Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#150e24]/60 border border-white/5 rounded-[2.5rem] p-8 space-y-12">
        {state?.error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl mb-6">
            <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
              ⚠️ {state.error}
            </p>
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl mb-6">
            <p className="text-[10px] text-rose-300 font-black uppercase tracking-[0.2em]">
              ⚠️ Please fix the validation errors below.
            </p>
          </div>
        )}
        {successMessage && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl mb-6">
            <p className="text-[10px] text-emerald-300 font-black uppercase tracking-[0.2em]">
              ✅ {successMessage}
            </p>
          </div>
        )}
  
        {/* SHIPMENT IDENTITY */}
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">SHIPMENT IDENTITY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input label="Shipping Date" name="shipping_date" type="date" value={formValues.shippingDate} onChange={(v) => handleFieldChange('shippingDate', v)} error={state?.fieldErrors?.shipping_date} clientError={errors.shippingDate} />
            <Select label="Shipping Type" name="shipping_type" options={['STANDARD', 'EXPRESS', 'REGULAR']} value={formValues.shippingType} onChange={(v) => handleFieldChange('shippingType', v)} error={state?.fieldErrors?.shipping_type} clientError={errors.shippingType} />
            <input type="hidden" name="shipment_status" value="ON ROUTE" />
          </div>
        </div>

        {/* SENDER & RECEIVER */}
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">SENDER & RECEIVER</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input label="Sender Name" name="sender_name" value={formValues.senderName} onChange={(v) => handleFieldChange('senderName', v)} error={state?.fieldErrors?.sender_name} clientError={errors.senderName} />
            <Input label="Receiver Name" name="receiver_name" value={formValues.receiverName} onChange={(v) => handleFieldChange('receiverName', v)} error={state?.fieldErrors?.receiver_name} clientError={errors.receiverName} />
            <Input label="Phone Number" name="phone_number" value={formValues.phoneNumber} onChange={(v) => handleFieldChange('phoneNumber', v)} error={state?.fieldErrors?.phone_number} clientError={errors.phoneNumber} />
            <Input label="Origin City" name="origin_city" value={formValues.originCity} onChange={(v) => handleFieldChange('originCity', v)} error={state?.fieldErrors?.origin_city} clientError={errors.originCity} />
            <Input label="Destination City" name="destination_city" value={formValues.destinationCity} onChange={(v) => handleFieldChange('destinationCity', v)} error={state?.fieldErrors?.destination_city} clientError={errors.destinationCity} />
          </div>
        </div>

        {/* CARGO DETAIL */}
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">CARGO DETAIL</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <Input label="Item Name" name="item_name" value={formValues.itemName} onChange={(v) => handleFieldChange('itemName', v)} error={state?.fieldErrors?.item_name} clientError={errors.itemName} />
            <Input label="Item Type" name="item_type" value={formValues.itemType} onChange={(v) => handleFieldChange('itemType', v)} error={state?.fieldErrors?.item_type} clientError={errors.itemType} />
            <Input label="Item Weight (kg)" name="item_weight" value={formValues.itemWeight} onChange={(v) => handleFieldChange('itemWeight', v)} error={state?.fieldErrors?.item_weight} clientError={errors.itemWeight} />
            <ReadOnlyInput 
              label="Price / Rate (Auto)" 
              name="price" 
              value={formValues.price} 
              clientError={errors.price}
            />
          </div>
        </div>

        {/* Vehicle Detail */}
        <div>
          <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-[#bc66ff] mb-6">Vehicle Detail</h2>
          
          {/* Hidden input untuk dikirim ke server */}
          <input type="hidden" name="vehicle_id" value={selectedVehicleId} /> 

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">Vehicle / Kapal *</label>
              <select
                value={selectedVehicleId}
                onChange={(e) => { setSelectedVehicleId(e.target.value); setErrors((prev) => ({ ...prev, vehicleId: '' })); }}
                className={`w-full bg-black/30 border ${errors.vehicleId ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm outline-none focus:border-[#bc66ff]/60`}
              >
                <option value="">Select a Vehicle</option>
                {vehicles.map((v: Vehicle) => (
                  <option key={v.id.toString()} value={v.id.toString()}>
                    {v.vehicle_name} ({v.vehicle_code}) - {v.vehicle_status}
                  </option>
                ))}
              </select>
              {errors.vehicleId && <p className="text-red-500 text-xs mt-1">{errors.vehicleId}</p>}
            </div>
            
            {/* Input Read-Only yang sudah reaktif */}
            <ReadOnlyInput 
              label="Vehicle Type" 
              name="vehicleType" 
              value={formValues.vehicleType} // Gunakan state formValues
            />
            <ReadOnlyInput 
              label="Vehicle Code" 
              name="vehicleCode" 
              value={formValues.vehicleCode} // Gunakan state formValues
            />
            <ReadOnlyInput 
              label="Vehicle Capacity" 
              name="vehicleCapacity" 
              value={formValues.vehicleCapacity} // Gunakan state formValues
            />
            <ReadOnlyInput 
              label="Vehicle Status" 
              name="vehicleStatus" 
              value={formValues.vehicleStatus} // Gunakan state formValues
            />
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
            disabled={isPending || isSubmitting}
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
          <button
            type="submit"
            disabled={isPending || isSubmitting}
            className="bg-[#bc66ff] text-black px-8 py-4 rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
          >
            {isPending || isSubmitting ? 'Saving...' : 'Save Shipment'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ==================== INPUT COMPONENT WITH ERROR HANDLING ====================
// 1. Perbaikan pada Input
// 1. Perbaikan Komponen Input
function Input({ label, name, type = 'text', value, onChange, error, clientError }: { 
  label: string; 
  name: string; 
  type?: string; 
  value: string; 
  onChange: (val: string) => void;
  error?: string[]; 
  clientError?: string;
}) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <input 
        name={name} 
        type={type} 
        value={value} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} 
        // Tambahkan border merah jika ada error
        className={`w-full bg-black/30 border ${error || clientError ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm`} 
      />
      {clientError && <p className="text-red-500 text-xs mt-1">{clientError}</p>}
      {!clientError && error && <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">{error[0]}</p>}
    </div>
  );
}

// 2. Perbaikan Komponen Select
function Select({ label, name, options, value, onChange, error, clientError }: { 
  label: string; 
  name: string; 
  options: any[]; 
  value: string; 
  onChange: (val: string) => void; 
  error?: string[];
  clientError?: string;
}) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <select 
        name={name} 
        value={value} 
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)} 
        className={`w-full bg-black/30 border ${error || clientError ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm`}
      >
        <option value="">Select option</option>
        {options.map((opt: any, index: number) => {
          const isObj = typeof opt === 'object' && opt !== null;
          return (
            <option key={isObj ? opt.id : index} value={isObj ? opt.id : opt}>
              {isObj ? opt.vehicle_name : opt}
            </option>
          );
        })}
      </select>
      {clientError && <p className="text-red-500 text-xs mt-1">{clientError}</p>}
      {!clientError && error && <p className="text-[9px] text-rose-400 font-black uppercase tracking-[0.2em] mt-2">{error[0]}</p>}
    </div>
  );
}

function ReadOnlyInput({ label, name, value, clientError }: { label: string; name: string; value: string; clientError?: string; }) {
  return (
    <div>
      <label className="block text-[9px] text-white/40 font-black uppercase tracking-[0.25em] mb-3">{label}</label>
      <input 
        name={name} // Ini penting agar terhubung ke formData
        value={value} 
        readOnly // Membuatnya tidak bisa diketik manual tapi tetap bisa terisi
        className={`w-full bg-black/30 border ${clientError ? 'border-red-500' : 'border-white/10'} rounded-2xl px-5 py-4 text-sm text-white/70`} 
      />
      {clientError && <p className="text-red-500 text-xs mt-1">{clientError}</p>}
    </div>
  );
}