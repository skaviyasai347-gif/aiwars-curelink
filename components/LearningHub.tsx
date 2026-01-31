
import React, { useState } from 'react';
import { GraduationCap, PlayCircle, FileText, Award, ChevronRight, Brain, Star, CheckCircle } from 'lucide-react';

const LearningHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('courses');

  const courses = [
    { id: '1', title: 'Basic First Aid & CPR', category: 'Emergency', duration: '45 mins', level: 'Beginner', progress: 0 },
    { id: '2', title: 'Mental Wellness 101', category: 'Wellbeing', duration: '30 mins', level: 'Beginner', progress: 85 },
    { id: '3', title: 'Preventing Communicable Diseases', category: 'Awareness', duration: '20 mins', level: 'Intermediate', progress: 100 },
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-100">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-4">Empower Your Health Literacy</h2>
            <p className="text-blue-100 text-lg mb-6">Learn life-saving skills and reliable medical awareness through interactive modules designed for students and families.</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-white text-blue-600 rounded-2xl font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/10">
                Continue Learning
              </button>
              <button className="px-6 py-3 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-colors border border-white/20">
                Browse Library
              </button>
            </div>
          </div>
          <div className="hidden lg:block shrink-0">
            <div className="w-48 h-48 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md relative">
              <GraduationCap size={80} className="text-white/80" />
              <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center shadow-lg font-bold border-4 border-indigo-600">
                1240 XP
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-20 w-48 h-48 border-4 border-white rounded-3xl rotate-45"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-4 border-b pb-4">
            <button 
              onClick={() => setActiveTab('courses')}
              className={`px-4 py-2 font-bold transition-all border-b-2 ${activeTab === 'courses' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              My Courses
            </button>
            <button 
              onClick={() => setActiveTab('quizzes')}
              className={`px-4 py-2 font-bold transition-all border-b-2 ${activeTab === 'quizzes' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            >
              Health Quizzes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.id} className="glass-card rounded-2xl p-5 border border-gray-100 hover:border-blue-200 transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <PlayCircle size={24} />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{course.category}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><Brain size={12} /> {course.level}</span>
                  <span className="flex items-center gap-1"><FileText size={12} /> {course.duration}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award size={20} className="text-yellow-500" />
              Achievements
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center shrink-0 border-2 border-yellow-200">
                  <Star size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold">Fast Responder</p>
                  <p className="text-xs text-gray-500">Completed CPR Awareness Module</p>
                </div>
              </div>
              <div className="flex items-center gap-4 grayscale opacity-50">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0 border-2 border-blue-200">
                  <Award size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400">Vaccine Hero</p>
                  <p className="text-xs text-gray-500">Log 5 complete vaccinations</p>
                </div>
              </div>
            </div>
            <button className="w-full mt-6 py-2 border-2 border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">
              View All Badges
            </button>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6">
            <h3 className="font-bold text-indigo-900 mb-2">Did You Know?</h3>
            <p className="text-sm text-indigo-700 leading-relaxed italic">
              "Regular handwashing for 20 seconds with soap can reduce the risk of respiratory infections by 20% and diarrheal diseases by 40%."
            </p>
            <div className="mt-4 flex justify-end">
              <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                Source: WHO <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningHub;
