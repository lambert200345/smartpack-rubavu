
import React, { useState, useMemo } from 'react';
import { ParkingSession } from '../types';
import { CURRENCY } from '../constants';
import { generateSmartReport } from '../services/geminiService';

interface HistoryProps {
  sessions: ParkingSession[];
}

const History: React.FC<HistoryProps> = ({ sessions }) => {
  const [aiReport, setAiReport] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSmartReport = async () => {
    setIsGenerating(true);
    const report = await generateSmartReport(sessions);
    setAiReport(report);
    setIsGenerating(false);
  };

  const sortedSessions = useMemo(() => 
    [...sessions].sort((a, b) => b.entryTime.getTime() - a.entryTime.getTime()),
  [sessions]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Parking Logs</h2>
          <p className="text-slate-500 text-sm">Review recent activity and generate insights</p>
        </div>
        <button
          onClick={handleSmartReport}
          disabled={isGenerating || sessions.length === 0}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
          AI SMART ANALYSIS
        </button>
      </div>

      {aiReport && (
        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="bg-indigo-600 text-white p-2 rounded-lg shrink-0 mt-1">
              <i className="fas fa-robot text-sm"></i>
            </div>
            <div>
              <p className="font-bold text-indigo-900 mb-1">Executive Summary</p>
              <p className="text-indigo-800 leading-relaxed text-sm md:text-base">{aiReport}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Plate</th>
                <th className="px-6 py-4">Slot</th>
                <th className="px-6 py-4">Entry</th>
                <th className="px-6 py-4">Exit</th>
                <th className="px-6 py-4">Fee</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedSessions.map(session => (
                <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{session.plateNumber}</div>
                    <div className="text-xs text-slate-500">{session.phoneNumber || 'No phone'}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">#{session.slotId.split('-')[1]}</td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {session.entryTime.toLocaleDateString()}<br/>
                    {session.entryTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">
                    {session.exitTime ? (
                      <>
                        {session.exitTime.toLocaleDateString()}<br/>
                        {session.exitTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">
                    {session.totalFee ? `${session.totalFee.toLocaleString()} ${CURRENCY}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      session.status === 'ACTIVE' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {session.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic">
                    No parking sessions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
