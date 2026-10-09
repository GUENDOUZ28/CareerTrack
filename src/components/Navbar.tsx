import React, { useState } from 'react';
import { TabType } from '../types/job';
import { 
  Briefcase, 
  LayoutDashboard, 
  ListFilter, 
  Kanban, 
  Bell, 
  Plus, 
  Database, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenNewModal: () => void;
  onOpenDataModal: () => void;
  totalOffersCount: number;
  urgentRemindersCount: number;
  isSqliteConnected: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenNewModal,
  onOpenDataModal,
  totalOffersCount,
  urgentRemindersCount,
  isSqliteConnected
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'offers', label: 'Job Offers', icon: ListFilter },
    { id: 'tracker', label: 'Tracker Pipeline', icon: Kanban },
    { id: 'reminders', label: 'Reminders', icon: Bell }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                  Career<span className="text-indigo-600">Track</span>
                </span>
                <span className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                  isSqliteConnected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    isSqliteConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`} />
                  {isSqliteConnected ? 'SQLite DB' : 'Offline'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block">
                {totalOffersCount} {totalOffersCount === 1 ? 'Job' : 'Jobs'} in jobs.db
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const isReminders = item.id === 'reminders';

              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`} />
                  <span>{item.label}</span>

                  {isReminders && urgentRemindersCount > 0 && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-rose-500 rounded-full animate-pulse">
                      {urgentRemindersCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-2.5">
            <button
              onClick={onOpenDataModal}
              title="Backup, Export CSV/JSON, Import data"
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            >
              <Database className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenNewModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl shadow-xs shadow-indigo-200 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>New Job Offer</span>
            </button>
          </div>

          {/* Mobile Menu & Quick Add */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenNewModal}
              className="p-2 bg-indigo-600 text-white rounded-lg shadow-xs"
              title="New Job Offer"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in slide-in-from-top duration-150">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const isReminders = item.id === 'reminders';

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-600'}`} />
                  <span>{item.label}</span>
                </div>
                {isReminders && urgentRemindersCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold text-white bg-rose-500 rounded-full">
                    {urgentRemindersCount}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-2 border-t border-slate-100 mt-2 flex gap-2">
            <button
              onClick={() => {
                onOpenDataModal();
                setMobileMenuOpen(false);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm text-slate-700 bg-slate-100 rounded-lg"
            >
              <Database className="w-4 h-4" />
              <span>Backup & Import</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
