
import React, { useState } from 'react';
import { HashRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { 
  Activity, 
  Search, 
  Syringe, 
  Camera, 
  Hospital, 
  GraduationCap, 
  Bell, 
  Settings, 
  Mic,
  Home,
  Menu,
  X,
  Heart
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import DiseaseSearch from './components/DiseaseSearch';
import VaccinationManager from './components/VaccinationManager';
import SymptomChecker from './components/SymptomChecker';
import HospitalTracker from './components/HospitalTracker';
import LearningHub from './components/LearningHub';
import VoiceAssistant from './components/VoiceAssistant';

const App: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showVoiceAssistant, setShowVoiceAssistant] = useState(false);

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: Home },
    { to: '/disease-info', label: 'Disease Engine', icon: Search },
    { to: '/vaccination', label: 'Vaccination', icon: Syringe },
    { to: '/symptom-checker', label: 'Visual Check', icon: Camera },
    { to: '/hospitals', label: 'Hospitals', icon: Hospital },
    { to: '/learning', label: 'Learning Hub', icon: GraduationCap },
  ];

  return (
    <HashRouter>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full">
            <div className="p-6 flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                <Heart size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-blue-600">CureLink</span>
            </div>
            
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t space-y-2">
              <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Bell size={20} />
                <span>Alerts</span>
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2 text-gray-500 hover:text-gray-900 transition-colors">
                <Settings size={20} />
                <span>Settings</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          {/* Header */}
          <header className="h-16 bg-white/80 backdrop-blur-md border-b flex items-center justify-between px-6 lg:px-8 z-40 sticky top-0">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden lg:block">
              <h1 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Health Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors">
                  <span className="text-sm font-bold">JD</span>
                </button>
              </div>
            </div>
          </header>

          {/* Page View */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/disease-info" element={<DiseaseSearch />} />
              <Route path="/vaccination" element={<VaccinationManager />} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/hospitals" element={<HospitalTracker />} />
              <Route path="/learning" element={<LearningHub />} />
            </Routes>
          </div>

          {/* Floating Voice Assistant Toggle */}
          <button 
            onClick={() => setShowVoiceAssistant(true)}
            className="fixed bottom-6 right-6 w-14 h-14 gradient-primary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
          >
            <Mic size={28} />
          </button>

          {/* Voice Assistant Modal */}
          {showVoiceAssistant && (
            <VoiceAssistant onClose={() => setShowVoiceAssistant(false)} />
          )}
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
