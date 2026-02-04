
import React from 'react';
import { ParkingSlot, SlotStatus, ParkingSession } from '../types';
import { CURRENCY } from '../constants';

interface StatsOverviewProps {
  slots: ParkingSlot[];
  sessions: ParkingSession[];
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ slots, sessions }) => {
  const occupiedCount = slots.filter(s => s.status === SlotStatus.OCCUPIED).length;
  const availableCount = slots.filter(s => s.status === SlotStatus.AVAILABLE).length;
  
  const totalRevenue = sessions
    .filter(s => s.status === 'COMPLETED')
    .reduce((acc, curr) => acc + (curr.totalFee || 0), 0);

  const stats = [
    { label: 'Available Slots', value: availableCount, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: 'fa-check-circle' },
    { label: 'Occupied Now', value: occupiedCount, color: 'text-rose-600', bg: 'bg-rose-50', icon: 'fa-car' },
    { label: 'Total Revenue', value: `${totalRevenue.toLocaleString()} ${CURRENCY}`, color: 'text-blue-600', bg: 'bg-blue-50', icon: 'fa-coins' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className={`${stat.bg} p-6 rounded-2xl border border-white shadow-sm flex items-center justify-between`}>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
          </div>
          <div className={`${stat.color} opacity-20 text-3xl`}>
            <i className={`fas ${stat.icon}`}></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;
