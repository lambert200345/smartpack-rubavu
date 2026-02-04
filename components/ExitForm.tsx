
import React, { useMemo } from 'react';
import { ParkingSession } from '../types';
import { HOURLY_RATE, CURRENCY } from '../constants';

interface ExitFormProps {
  session: ParkingSession;
  onClose: () => void;
  onConfirm: (sessionId: string) => void;
}

const ExitForm: React.FC<ExitFormProps> = ({ session, onClose, onConfirm }) => {
  const calculations = useMemo(() => {
    const exitTime = new Date();
    const durationMs = exitTime.getTime() - session.entryTime.getTime();
    const durationMinutes = Math.max(1, Math.ceil(durationMs / (1000 * 60)));
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    
    // Revenue logic: 500 RWF per hour (calculated pro-rata)
    const totalFee = Math.ceil((durationMinutes / 60) * HOURLY_RATE);
    
    return { exitTime, durationMinutes, hours, mins, totalFee };
  }, [session]);

  return (
    <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform animate-in fade-in zoom-in duration-300">
        <div className="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-rose-100 text-rose-600 p-2 rounded-lg">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Vehicle Checkout</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-rose-600 transition-colors bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center bg-blue-600 p-6 rounded-2xl shadow-lg shadow-blue-100 text-white">
            <div>
              <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest mb-1">Vehicle Plate</p>
              <p className="text-3xl font-black">{session.plateNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-blue-100 font-bold uppercase tracking-widest mb-1">Bay Number</p>
              <p className="text-3xl font-black">#{session.slotId.split('-')[1]}</p>
            </div>
          </div>

          <div className="space-y-4 px-1">
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-400 text-sm font-medium">Check-in Time</span>
              <span className="font-bold text-slate-900">{session.entryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-50">
              <span className="text-slate-400 text-sm font-medium">Check-out Time</span>
              <span className="font-bold text-slate-900">{calculations.exitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400 text-sm font-medium">Duration</span>
              <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full text-xs">
                {calculations.hours}h {calculations.mins}m
              </span>
            </div>
            
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-100">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount Due</p>
                  <p className="text-xs text-slate-500 italic">Rate: {HOURLY_RATE} {CURRENCY} / hour</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-emerald-600 leading-none">
                    {calculations.totalFee.toLocaleString()}
                  </span>
                  <span className="text-sm font-black text-emerald-600 ml-1">{CURRENCY}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all"
            >
              Back
            </button>
            <button
              onClick={() => onConfirm(session.id)}
              className="flex-[2] px-6 py-4 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 transform active:scale-95"
            >
              <i className="fas fa-check-circle"></i>
              PAID & RELEASE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExitForm;
