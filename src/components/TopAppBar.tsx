import { useState, ReactNode } from 'react';
import { Map, BookOpen, Users, HelpCircle, Menu, X, Sun, Moon } from 'lucide-react';
import logoImg from '../assets/images/smiu_logo_1779567984801.png';

interface TopAppBarProps {
  activeTab: 'map' | 'history' | 'directory';
  onTabChange: (tab: 'map' | 'history' | 'directory') => void;
  onHomeClick: () => void;
  onHelpClick: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export default function TopAppBar({
  activeTab,
  onTabChange,
  onHomeClick,
  onHelpClick,
  isDarkMode,
  onToggleTheme,
}: TopAppBarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks: { tab: 'map' | 'history' | 'directory'; label: string; icon: ReactNode }[] = [
    { tab: 'map', label: 'Finder', icon: <Map className="h-4 w-4" /> },
    { tab: 'history', label: 'History', icon: <BookOpen className="h-4 w-4" /> },
    { tab: 'directory', label: 'Faculty', icon: <Users className="h-4 w-4" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#1A1A1A]/10 bg-[#FAF9F6]/95 backdrop-blur-sm" id="top-app-bar">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between h-14 relative">

        {/* Brand */}
        <button
          onClick={() => { onHomeClick(); setMenuOpen(false); }}
          className="flex items-center gap-2 cursor-pointer focus:outline-none"
          id="navbar-brand-btn"
        >
          <img
            src={logoImg}
            className="h-7 w-7 object-cover rounded"
            alt="SMIU Logo"
          />
          <span className="font-serif font-bold text-[#1A1A1A] text-base">
            Room Finder
          </span>
        </button>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {navLinks.map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded text-[10px] uppercase tracking-wider font-extrabold transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#1A1A1A] text-[#F9F7F2]'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
              }`}
              id={`navbar-tab-${tab}`}
            >
              {icon}
              {label}
            </button>
          ))}
          <button
            onClick={onHelpClick}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded text-[10px] uppercase tracking-wider font-extrabold text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all cursor-pointer"
            id="navbar-help-btn"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </button>
        </div>

        {/* Action Area (Theme Toggle + Mobile Menu Button) */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all cursor-pointer flex items-center justify-center"
            id="theme-toggle-btn"
            aria-label="Toggle light/dark theme"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 fill-amber-500 animate-spin-slow" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-slate-700 fill-slate-700" />
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all cursor-pointer"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            id="navbar-mobile-toggle"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[#1A1A1A]/10 bg-[#FAF9F6] px-4 py-3 flex flex-col gap-1" id="navbar-mobile-menu">
          {navLinks.map(({ tab, label, icon }) => (
            <button
              key={tab}
              onClick={() => { onTabChange(tab); setMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2.5 rounded text-xs uppercase tracking-wider font-extrabold transition-all cursor-pointer w-full text-left ${
                activeTab === tab
                  ? 'bg-[#1A1A1A] text-[#F9F7F2]'
                  : 'text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
              }`}
              id={`navbar-mobile-tab-${tab}`}
            >
              {icon}
              {label}
            </button>
          ))}
          <button
            onClick={() => { onHelpClick(); setMenuOpen(false); }}
            className="flex items-center gap-2 px-3 py-2.5 rounded text-xs uppercase tracking-wider font-extrabold text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all cursor-pointer w-full text-left"
            id="navbar-mobile-help-btn"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </button>

          {/* Mobile theme toggle */}
          <button
            onClick={() => { onToggleTheme(); setMenuOpen(false); }}
            className="flex items-center gap-2 px-3 py-2.5 rounded text-xs uppercase tracking-wider font-extrabold text-[#1A1A1A]/70 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5 transition-all cursor-pointer w-full text-left border-t border-[#1A1A1A]/10 mt-1 pt-2"
            id="navbar-mobile-theme-toggle"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-500 fill-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700 fill-slate-700" />
            )}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      )}
    </nav>
  );
}
