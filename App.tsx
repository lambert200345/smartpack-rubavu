
import React, { useState, useEffect, useMemo } from 'react';
import { SlotStatus, ParkingSlot, ParkingSession } from './types';
import { INITIAL_SLOTS, HOURLY_RATE, CURRENCY } from './constants';
import Dashboard from './components/Dashboard';
import EntryForm from './components/EntryForm';
import ExitForm from './components/ExitForm';
import History from './components/History';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';

const App: React.FC = () => {
  const [slots, setSlots] = useState<ParkingSlot[]>(() => {
    const saved = localStorage.getItem('smartpark_slots');
    return saved ? JSON.parse(saved) : INITIAL_SLOTS;
  });

  const [sessions, setSessions] = useState<ParkingSession[]>(() => {
    const saved = localStorage.getItem('smartpark_sessions');
    return saved ? JSON.parse(saved).map((s: any) => ({
      ...s,
      entryTime: new Date(s.entryTime),
      exitTime: s.exitTime ? new Date(s.exitTime) : undefined
    })) : [];
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'entry' | 'history'>('dashboard');
  const [selectedSlotForExit, setSelectedSlotForExit] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('smartpark_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('smartpark_sessions', JSON.stringify(sessions));
  }, [sessions]);

  const activeSessions = useMemo(() => 
    sessions.filter(s => s.status === 'ACTIVE'), 
  [sessions]);

  const handleEntry = (entryData: Omit<ParkingSession, 'id' | 'status' | 'entryTime'>) => {
    const newSession: ParkingSession = {
      ...entryData,
      id: `sess-${Date.now()}`,
      status: 'ACTIVE',
      entryTime: new Date(),
    };

    setSessions(prev => [newSession, ...prev]);
    setSlots(prev => prev.map(s => 
      s.id === entryData.slotId ? { ...s, status: SlotStatus.OCCUPIED } : s
    ));
    setActiveTab('dashboard');
  };

  const handleExit = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    const exitTime = new Date();
    const durationMs = exitTime.getTime() - session.entryTime.getTime();
    const durationMinutes = Math.max(1, Math.ceil(durationMs / (1000 * 60)));
    // 500 RWF per hour calculation
    const totalFee = Math.ceil((durationMinutes / 60) * HOURLY_RATE);

    setSessions(prev => prev.map(s => 
      s.id === sessionId ? { 
        ...s, 
        status: 'COMPLETED', 
        exitTime, 
        durationMinutes, 
        totalFee 
      } : s
    ));

    setSlots(prev => prev.map(s => 
      s.id === session.slotId ? { ...s, status: SlotStatus.AVAILABLE } : s
    ));
    
    setSelectedSlotForExit(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Navigation on the left for desktop, bottom for mobile */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Content area on the right */}
      <main className="flex-1 px-4 py-8 md:px-10 lg:px-16 md:py-12 overflow-y-auto h-screen scroll-smooth">
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              {activeTab === 'dashboard' && 'Operations Overview'}
              {activeTab === 'entry' && 'Vehicle Check-In'}
              {activeTab === 'history' && 'Activity Logs'}
            </h1>
            <p className="text-slate-500 mt-1 font-medium">SmartPark Rubavu Management System</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pricing Policy</p>
            <p className="text-sm font-bold text-blue-600">{HOURLY_RATE} {CURRENCY} / Hour</p>
          </div>
        </header>

        <div className="max-w-6xl">
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <StatsOverview slots={slots} sessions={sessions} />
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <i className="fas fa-th-large text-blue-500"></i>
                  Parking Grid Status
                </h3>
                <Dashboard 
                  slots={slots} 
                  activeSessions={activeSessions} 
                  onExitInitiate={setSelectedSlotForExit} 
                />
              </div>
            </div>
          )}

          {activeTab === 'entry' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <EntryForm 
                availableSlots={slots.filter(s => s.status === SlotStatus.AVAILABLE)}
                onSubmit={handleEntry}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <History sessions={sessions} />
            </div>
          )}
        </div>
      </main>

      {/* Exit Modal */}
      {selectedSlotForExit && (
        <ExitForm 
          session={activeSessions.find(s => s.slotId === selectedSlotForExit)!}
          onClose={() => setSelectedSlotForExit(null)}
          onConfirm={handleExit}
        />
      )}
    </div>
  );
};

export default App;
