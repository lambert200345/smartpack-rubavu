
import React from 'react';
import { ParkingSlot, SlotStatus, ParkingSession } from '../types';

interface DashboardProps {
  slots: ParkingSlot[];
  activeSessions: ParkingSession[];
  onExitInitiate: (slotId: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ slots, activeSessions, onExitInitiate }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {slots.map(slot => {
        const session = activeSessions.find(s => s.slotId === slot.id);
        const isOccupied = slot.status === SlotStatus.OCCUPIED;

        return (
          <div 
            key={slot.id}
            className={`relative p-4 rounded-xl border-2 transition-all group ${
              isOccupied 
                ? 'bg-rose-50 border-rose-200' 
                : 'bg-emerald-50 border-emerald-200 hover:shadow-md cursor-default'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
                isOccupied ? 'bg-rose-200 text-rose-700' : 'bg-emerald-200 text-emerald-700'
              }`}>
                {slot.number}
              </span>
              {isOccupied && (
                <i className="fas fa-car text-rose-500 animate-pulse"></i>
              )}
            </div>

            <div className="min-h-[40px]">
              {isOccupied ? (
                <div className="space-y-1">
                  <p className="font-bold text-sm text-rose-900 truncate">{session?.plateNumber}</p>
                  <p className="text-xs text-rose-600">Entered: {session?.entryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ) : (
                <p className="text-emerald-700 font-medium text-sm">Available</p>
              )}
            </div>

            {isOccupied && (
              <button 
                onClick={() => onExitInitiate(slot.id)}
                className="mt-3 w-full bg-rose-600 text-white text-xs py-2 rounded-lg font-semibold hover:bg-rose-700 transition-colors shadow-sm"
              >
                CHECK OUT
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
