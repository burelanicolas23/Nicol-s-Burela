
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-[#111b21] border-b border-gray-800 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-[#00ff7f] p-2 rounded-lg">
            <svg className="w-6 h-6 text-[#0b141a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-black text-[#00ff7f] tracking-tighter uppercase">
            24Seven
          </span>
        </div>

        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-gray-200">{user.name}</span>
              <span className="text-[10px] text-[#00ff7f] font-black uppercase tracking-widest">
                {user.role === UserRole.MERCHANT ? (user.storeName || 'Comerciante') : 'Cliente'}
              </span>
            </div>
            <button 
              onClick={onLogout}
              className="px-4 py-2 text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-rose-500/30"
            >
              Salir
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
