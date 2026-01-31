
import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  MapPin, 
  ArrowUpRight, 
  CheckCircle2,
  Calendar,
  Syringe
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Dashboard: React.FC = () => {
  const vaccinationProgress = [
    { name: 'Polio', completed: 100 },
    { name: 'DTP', completed: 100 },
    { name: 'MMR', completed: 0 },
    { name: 'Hepatitis B', completed: 50 },
  ];

  const regionalOutbreakData = [
    { date: 'Mon', cases: 12 },
    { date: 'Tue', cases: 19 },
    { date: 'Wed', cases: 15 },
    { date: 'Thu', cases: 30 },
    { date: 'Fri', cases: 25 },
    { date: 'Sat', cases: 42 },
    { date: 'Sun', cases: 38 },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome & Primary Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-2xl p-8 flex flex-col justify-between overflow-hidden relative min-h-[200px]">
          <div className="z-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Hello, Jane Doe</h2>
            <p className="text-gray-500 max-w-md">Your personalized health guardian is active. Stay informed with real-time updates for your region.</p>
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                View My History
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -mr-20 -mt-20 opacity-50"></div>
          <div className="absolute bottom-0 right-0 p-8 hidden md:block">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full font-medium text-sm">
              <ShieldCheck size={16} />
              Health Score: 92%
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-4 text-red-600">
            <AlertTriangle size={24} />
            <h3 className="font-bold text-lg">Local Alert</h3>
          </div>
          <p className="text-red-800 font-medium mb-4">Rise in Seasonal Influenza cases reported in Manhattan, NY.</p>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-red-700">
              <CheckCircle2 size={16} />
              Wear masks in crowded areas
            </div>
            <div className="flex items-center gap-2 text-sm text-red-700">
              <CheckCircle2 size={16} />
              Check your flu shot status
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Outbreak Trend */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Regional Outbreak Trend</h3>
              <p className="text-sm text-gray-500">Weekly Influenza Activity</p>
            </div>
            <span className="p-2 bg-gray-100 rounded-lg text-gray-500">
              <MapPin size={18} />
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={regionalOutbreakData}>
                <defs>
                  <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" hide />
                <Tooltip />
                <Area type="monotone" dataKey="cases" stroke="#ef4444" fillOpacity={1} fill="url(#colorCases)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Vaccination Status */}
        <div className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Vaccination Status</h3>
              <p className="text-sm text-gray-500">Upcoming: MMR Dose 2</p>
            </div>
            <span className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <Syringe size={18} />
            </span>
          </div>
          <div className="space-y-4">
            {vaccinationProgress.map((v) => (
              <div key={v.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{v.name}</span>
                  <span className="font-medium">{v.completed}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-1000 ${v.completed === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${v.completed}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links / Resource Stats */}
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl">
          <h3 className="font-bold text-lg mb-4">Quick Resources</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100 mb-1">Nearby Hospitals</p>
              <p className="text-2xl font-bold">12</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100 mb-1">ICU Beds Avail.</p>
              <p className="text-2xl font-bold">45</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100 mb-1">Blood Centers</p>
              <p className="text-2xl font-bold">03</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-xs text-blue-100 mb-1">Air Quality</p>
              <p className="text-2xl font-bold text-green-300">42</p>
            </div>
          </div>
          <button className="w-full mt-6 py-3 bg-white text-blue-600 rounded-xl font-bold flex items-center justify-center gap-2 group">
            Emergency Help
            <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar size={20} className="text-blue-600" />
          Recent Health Activity
        </h3>
        <div className="space-y-6">
          {[
            { date: 'Oct 24, 2023', action: 'Vaccination Appointment Scheduled', detail: 'MMR Dose 2 at Central Hospital', type: 'info' },
            { date: 'Oct 20, 2023', action: 'Visual Symptom Check Performed', detail: 'Skin rash analysis - Result: Possible Heat Rash', type: 'success' },
            { date: 'Oct 15, 2023', action: 'Disease Info Searched', detail: 'Symptoms of Dengue Fever', type: 'info' },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mt-1"></div>
                {i !== 2 && <div className="w-px h-full bg-gray-200 mt-2"></div>}
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wider">{item.date}</p>
                <p className="font-bold text-gray-900">{item.action}</p>
                <p className="text-sm text-gray-500">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
