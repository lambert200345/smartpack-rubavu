
import React, { useState, useRef } from 'react';
import { ParkingSlot, ParkingSession } from '../types';
import { analyzePlateImage } from '../services/geminiService';

interface EntryFormProps {
  availableSlots: ParkingSlot[];
  onSubmit: (data: Omit<ParkingSession, 'id' | 'status' | 'entryTime'>) => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ availableSlots, onSubmit }) => {
  const [formData, setFormData] = useState({
    plateNumber: '',
    driverName: '',
    phoneNumber: '',
    slotId: availableSlots[0]?.id || '',
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const plate = await analyzePlateImage(base64);
      if (plate !== 'UNKNOWN') {
        setFormData(prev => ({ ...prev, plateNumber: plate }));
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plateNumber || !formData.slotId) return;
    onSubmit(formData);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
      <div className="bg-blue-600 p-6 text-white">
        <h2 className="text-xl font-bold">New Entry Check-in</h2>
        <p className="text-blue-100 text-sm">Register a car arrival at Rubavu SmartPark</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Vehicle Plate Number</label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="e.g. RAC 123A"
              className="flex-1 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.plateNumber}
              onChange={e => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-3 bg-slate-100 rounded-lg text-slate-600 hover:bg-slate-200 transition-colors"
              title="Scan plate from photo"
            >
              <i className={`fas ${isAnalyzing ? 'fa-spinner fa-spin' : 'fa-camera'}`}></i>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload} 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Driver Name</label>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.driverName}
              onChange={e => setFormData({ ...formData, driverName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Phone Number</label>
            <input
              type="tel"
              placeholder="+250..."
              className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.phoneNumber}
              onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Select Available Slot</label>
          <select
            className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={formData.slotId}
            onChange={e => setFormData({ ...formData, slotId: e.target.value })}
          >
            {availableSlots.length > 0 ? (
              availableSlots.map(slot => (
                <option key={slot.id} value={slot.id}>Slot #{slot.number}</option>
              ))
            ) : (
              <option disabled>No slots available</option>
            )}
          </select>
        </div>

        <button
          type="submit"
          disabled={availableSlots.length === 0}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          COMPLETE CHECK-IN
        </button>
      </form>
    </div>
  );
};

export default EntryForm;
