
import React, { useState } from 'react';
import { Syringe, Plus, Calendar, CheckCircle2, AlertCircle, Trash2, Clock } from 'lucide-react';

const VaccinationManager: React.FC = () => {
  const [vaccinations, setVaccinations] = useState([
    { id: '1', name: 'BCG', age: 'Birth', status: 'completed', date: '2023-01-15' },
    { id: '2', name: 'Polio (OPV) 1', age: '6 Weeks', status: 'completed', date: '2023-03-01' },
    { id: '3', name: 'Hepatitis B', age: '14 Weeks', status: 'completed', date: '2023-04-20' },
    { id: '4', name: 'MMR Dose 1', age: '9 Months', status: 'pending', date: '2023-11-15' },
    { id: '5', name: 'Flu Shot', age: 'Annual', status: 'pending', date: '2023-12-01' },
  ]);

  const toggleStatus = (id: string) => {
    setVaccinations(prev => prev.map(v => 
      v.id === id ? { ...v, status: v.status === 'completed' ? 'pending' : 'completed' } : v
    ));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vaccination Manager</h2>
          <p className="text-gray-500">Track immunization schedules and set smart reminders.</p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
          <Plus size={20} />
          Add Vaccination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Vaccination Timeline</h3>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">3 Completed · 2 Pending</span>
            </div>
            <div className="divide-y">
              {vaccinations.map((v) => (
                <div key={v.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      v.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Syringe size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{v.name}</h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1"><Clock size={12} /> {v.age}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {v.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleStatus(v.id)}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition-all ${
                        v.status === 'completed' 
                        ? 'bg-green-500 text-white' 
                        : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      {v.status === 'completed' ? 'Completed' : 'Mark Done'}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border-blue-100 bg-blue-50/30">
            <h3 className="font-bold text-blue-900 mb-4">Upcoming Schedule</h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border shadow-sm border-blue-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                  <span className="text-sm font-bold text-blue-900">MMR Dose 1</span>
                </div>
                <p className="text-xs text-blue-700 mb-3">Due in 22 days (Nov 15)</p>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                  Find Vaccination Center
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <div className="flex items-center gap-2 text-gray-900 font-bold mb-4">
              <CheckCircle2 size={18} className="text-green-500" />
              Health Recommendation
            </div>
            <p className="text-sm text-gray-500 leading-relaxed italic">
              "Based on your child's age, it's recommended to schedule a follow-up consultation for the seasonal flu vaccine before the winter peak."
            </p>
            <div className="mt-4 pt-4 border-t flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">AI</div>
              <div>
                <p className="text-xs font-bold">CureLink Advisor</p>
                <p className="text-[10px] text-gray-400">Powered by CDC Guidelines</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaccinationManager;
