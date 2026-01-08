
import React from 'react';
import { PortfolioStats } from '../types';

interface HeaderProps {
    onToggleLanguage: () => void;
}

const Header_ar: React.FC<HeaderProps> = ({ onToggleLanguage }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-3xl border-b border-white/5 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3 group cursor-default">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black font-black text-xl shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-105">م</div>
             <div className="flex flex-col">
                 <span className="text-xl font-bold text-white tracking-tight leading-none">مثوى</span>
                 <span className="text-[10px] font-medium text-white/50 tracking-[0.2em] uppercase mt-0.5">إدارة الأملاك</span>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
                onClick={onToggleLanguage}
                className="px-4 py-2 text-xs font-bold text-white bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-white/10 uppercase tracking-widest backdrop-blur-md active:scale-95 font-cairo"
            >
                English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header_ar;
