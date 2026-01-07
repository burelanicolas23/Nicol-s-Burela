
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.CUSTOMER);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    storeName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const displayName = formData.name.trim() || (role === UserRole.MERCHANT ? 'Nuevo Comerciante' : 'Nuevo Cliente');
    const displayStore = role === UserRole.MERCHANT ? (formData.storeName.trim() || 'Mi Tienda Local') : undefined;

    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: displayName,
      email: formData.email,
      role: role,
      storeName: displayStore,
      isOpen: true,
      basePrepTime: 5,
      openingTime: '08:00',
      closingTime: '22:00',
      currency: '€' // Default currency
    };
    onLogin(mockUser);
  };

  return (
    <div className="max-w-md mx-auto bg-[#111b21] rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-800 animate-in fade-in zoom-in-95 duration-500">
      <div className="p-10">
        <div className="text-center mb-10">
          <div className="bg-[#00ff7f] w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#00ff7f]/20">
             <svg className="w-8 h-8 text-[#0b141a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h2 className="text-3xl font-black text-[#00ff7f] mb-2 tracking-tighter uppercase">
            {isRegistering ? 'Registro 24Seven' : 'Acceso Directo'}
          </h2>
          <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">Plataforma de comercio instantáneo</p>
        </div>

        <div className="flex mb-8 bg-[#0b141a] p-1.5 rounded-2xl border border-gray-800">
          <button
            onClick={() => setRole(UserRole.CUSTOMER)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              role === UserRole.CUSTOMER ? 'bg-[#2a3942] text-[#00ff7f]' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            Cliente
          </button>
          <button
            onClick={() => setRole(UserRole.MERCHANT)}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
              role === UserRole.MERCHANT ? 'bg-[#2a3942] text-[#00ff7f]' : 'text-gray-600 hover:text-gray-400'
            }`}
          >
            Comerciante
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div className="animate-in slide-in-from-left-2 duration-300">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1.5 ml-1">Nombre Real</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 bg-[#2a3942] border-none rounded-2xl text-white font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#00ff7f] outline-none transition-all"
                placeholder="Ej. Carlos Ruiz"
              />
            </div>
          )}

          {isRegistering && role === UserRole.MERCHANT && (
            <div className="animate-in slide-in-from-left-2 duration-400">
              <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1.5 ml-1">Nombre Comercial</label>
              <input
                required
                type="text"
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                className="w-full px-5 py-4 bg-[#2a3942] border-none rounded-2xl text-white font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#00ff7f] outline-none transition-all"
                placeholder="Ej. Súper Express 24h"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1.5 ml-1">Email Corporativo</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-5 py-4 bg-[#2a3942] border-none rounded-2xl text-white font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#00ff7f] outline-none transition-all"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1.5 ml-1">Pin de Seguridad</label>
            <input
              required
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-5 py-4 bg-[#2a3942] border-none rounded-2xl text-white font-bold placeholder:text-gray-600 focus:ring-2 focus:ring-[#00ff7f] outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#00ff7f] text-[#0b141a] font-black py-4.5 px-4 rounded-2xl hover:brightness-110 transform transition-all active:scale-[0.98] shadow-xl shadow-[#00ff7f]/10 uppercase tracking-widest text-[10px]"
          >
            {isRegistering ? 'Crear Perfil' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-[10px] font-black text-gray-500 hover:text-[#00ff7f] uppercase tracking-widest transition-colors"
          >
            {isRegistering ? 'Ya tengo cuenta' : 'Nueva cuenta de usuario'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
