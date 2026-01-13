import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, Coins, Zap, Briefcase, LogOut, Download, User as UserIcon, Share2, Copy, Check, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import IncomeTracker from './components/IncomeTracker';
import SideHustleAI from './components/SideHustleAI';
import ConcorsiSearch from './components/ConcorsiSearch';
import Auth from './components/Auth';
import { ExtraIncome, User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('arrotondami_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tracker' | 'ai' | 'concorsi'>('dashboard');
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [incomes, setIncomes] = useState<ExtraIncome[]>([]);
  const [goal, setGoal] = useState<number>(500);

  useEffect(() => {
    if (currentUser) {
      const savedIncomes = localStorage.getItem(`incomes_${currentUser.id}`);
      const savedGoal = localStorage.getItem(`goal_${currentUser.id}`);
      setIncomes(savedIncomes ? JSON.parse(savedIncomes) : []);
      setGoal(savedGoal ? parseFloat(savedGoal) : 500);
      localStorage.setItem('arrotondami_current_user', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`incomes_${currentUser.id}`, JSON.stringify(incomes));
    }
  }, [incomes, currentUser]);

  const addIncome = (income: Omit<ExtraIncome, 'id'>) => {
    const newIncome = { ...income, id: Date.now().toString() };
    setIncomes(prev => [newIncome, ...prev]);
  };

  const deleteIncome = (id: string) => {
    setIncomes(prev => prev.filter(item => item.id !== id));
  };

  const handleLogout = () => {
    if (confirm('Vuoi uscire dal profilo? I tuoi dati rimarranno salvati in questo browser.')) {
      setCurrentUser(null);
      localStorage.removeItem('arrotondami_current_user');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!currentUser) {
    return <Auth onLogin={setCurrentUser} />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracker', label: 'Le mie Entrate', icon: PlusCircle },
    { id: 'concorsi', label: 'Posto Fisso', icon: Briefcase },
    { id: 'ai', label: 'Crea Ricchezza', icon: Zap },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-['Inter']">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-80 bg-white border-r border-slate-100 shadow-xl z-30">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-slate-900 p-2.5 rounded-2xl text-white shadow-lg">
            <Coins size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 leading-none">Wealth Engine</h1>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">ArrotondaMi Elite</span>
          </div>
        </div>

        <div className="px-6 mb-6">
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl ${currentUser.avatarColor} flex items-center justify-center text-white shadow-lg`}>
              <UserIcon size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profilo</p>
              <p className="text-sm font-black text-slate-800 truncate">{currentUser.name}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={18} />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === item.id 
                  ? 'bg-slate-900 text-white shadow-lg' 
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon size={22} className={activeTab === item.id ? 'text-blue-400' : ''} />
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-50 space-y-4">
          <button 
            onClick={() => setShowShareModal(true)}
            className="w-full bg-blue-50 text-blue-700 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-100 transition-all border border-blue-100"
          >
            <Share2 size={18} /> Invita un Amico
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        <div className="max-w-6xl mx-auto p-4 md:p-12 pb-32 md:pb-12">
          {activeTab === 'dashboard' && <Dashboard incomes={incomes} goal={goal} />}
          {activeTab === 'tracker' && <IncomeTracker incomes={incomes} onAdd={addIncome} onDelete={deleteIncome} />}
          {activeTab === 'ai' && <SideHustleAI />}
          {activeTab === 'concorsi' && <ConcorsiSearch />}
        </div>
      </main>

      {/* Modal Share */}
      {showShareModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-3xl">
                <Share2 size={32} />
              </div>
              <button onClick={() => setShowShareModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                <X size={20} />
              </button>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">Condividi Wealth Engine</h3>
            <p className="text-slate-500 mb-8">Aiuta i tuoi amici ad arrotondare lo stipendio.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 break-all text-sm font-medium text-slate-600">
                {window.location.origin}
              </div>
              <button 
                onClick={copyToClipboard}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
                  copied ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {copied ? <><Check size={20} /> Copiato!</> : <><Copy size={20} /> Copia Link</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 flex justify-around items-center z-50 shadow-2xl rounded-t-[2rem]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
          >
            <item.icon size={22} />
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default App;