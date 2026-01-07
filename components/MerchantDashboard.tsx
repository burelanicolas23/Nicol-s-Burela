
import React, { useState, useEffect } from 'react';
import { User, Product, Order } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MerchantDashboardProps {
  user: User;
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onUpdateOrder: (id: string, status: Order['status']) => void;
  onUpdateSettings: (user: User) => void;
}

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ 
  user, products, orders, onAddProduct, onUpdateProduct, onUpdateOrder, onUpdateSettings
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [newProd, setNewProd] = useState({
    name: '', price: '', stock: '', description: '', category: 'General', prepTime: '5'
  });
  const [settings, setSettings] = useState({
    storeName: user.storeName || '',
    opening: user.openingTime || '08:00',
    closing: user.closingTime || '14:00',
    opening2: user.openingTime2 || '17:00',
    closing2: user.closingTime2 || '22:00',
    currency: user.currency || '€'
  });

  const currencies = ['€', '$', '£', '¥', 'ARS', 'MXN', 'CLP', 'COP', 'PEN'];
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING' || o.status === 'ACCEPTED').length;

  // Notificación de cantidad de pedidos al cargar o cambiar
  useEffect(() => {
    if (pendingOrdersCount > 0) {
      const msg = `Atención: Tienes ${pendingOrdersCount} pedidos pendientes por hacer.`;
      if (!notifications.includes(msg)) {
        setNotifications(prev => [msg, ...prev].slice(0, 3));
      }
    }
  }, [pendingOrdersCount]);

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      id: Math.random().toString(36).substr(2, 9),
      merchantId: user.id,
      name: newProd.name,
      price: parseFloat(newProd.price),
      stock: parseInt(newProd.stock),
      description: newProd.description,
      category: newProd.category,
      prepTimeAdjustment: parseInt(newProd.prepTime),
      imageUrl: '',
      merchantName: settings.storeName,
      merchantOpening: settings.opening,
      merchantClosing: settings.closing,
      merchantOpening2: settings.opening2,
      merchantClosing2: settings.closing2,
      currency: settings.currency
    });
    setIsAdding(false);
    setNewProd({ name: '', price: '', stock: '', description: '', category: 'General', prepTime: '5' });
  };

  const handleSaveSettings = () => {
    onUpdateSettings({
      ...user,
      storeName: settings.storeName,
      openingTime: settings.opening,
      closingTime: settings.closing,
      openingTime2: settings.opening2,
      closingTime2: settings.closing2,
      currency: settings.currency
    });
    setShowSettings(false);
  };

  const salesData = products.map(p => ({
    name: p.name.substring(0, 10),
    stock: p.stock
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="fixed top-20 right-4 z-[60] space-y-2 pointer-events-none w-72">
        {notifications.map((note, i) => (
          <div key={i} className="bg-[#00ff7f] text-[#0b141a] px-6 py-4 rounded-2xl shadow-2xl font-black text-[10px] uppercase tracking-[0.1em] animate-in slide-in-from-right-10 duration-300 border border-white/20">
            🔔 {note}
          </div>
        ))}
      </div>

      <div className="bg-[#111b21] p-8 rounded-[2.5rem] border border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#00ff7f] tracking-tighter uppercase">
            Bienvenido, {user.name}
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            Panel de {user.storeName} • Tienes <span className="text-[#00ff7f]">{pendingOrdersCount} pedidos</span> activos
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="px-6 py-3.5 bg-[#2a3942] text-[#00ff7f] rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-[#3b4a54] transition-all border border-[#00ff7f]/20"
          >
            Ajustes de Tienda
          </button>
        </div>
      </div>

      {showSettings && (
        <div className="bg-[#111b21] p-10 rounded-[3rem] border border-[#00ff7f]/20 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-black text-[#00ff7f] uppercase tracking-tighter">Configuración</h3>
             <button onClick={() => setShowSettings(false)} className="text-gray-600 hover:text-white">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Nombre Comercial</label>
              <input 
                type="text" 
                value={settings.storeName} 
                onChange={e => setSettings({...settings, storeName: e.target.value})}
                className="w-full p-4 rounded-2xl bg-[#2a3942] border-none text-white font-bold focus:ring-2 focus:ring-[#00ff7f] outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">Moneda</label>
              <select 
                value={settings.currency} 
                onChange={e => setSettings({...settings, currency: e.target.value})}
                className="w-full p-4 rounded-2xl bg-[#2a3942] border-none text-[#00ff7f] font-black outline-none"
              >
                {currencies.map(curr => <option key={curr} value={curr}>{curr}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end">
             <button onClick={handleSaveSettings} className="px-10 py-4 bg-[#00ff7f] text-[#0b141a] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-[#00ff7f]/10">
               Guardar Cambios
             </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111b21] rounded-[2.5rem] border border-gray-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-black text-[#00ff7f] uppercase tracking-widest">Cola de Pedidos</h2>
              <span className="bg-[#00ff7f]/10 text-[#00ff7f] px-4 py-1.5 rounded-full text-[9px] font-black uppercase">
                {pendingOrdersCount} PENDIENTES
              </span>
            </div>
            <div className="divide-y divide-gray-800">
              {orders.length === 0 ? (
                <div className="p-20 text-center text-gray-700 font-bold uppercase tracking-widest text-xs italic">Sin actividad reciente</div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="p-8 hover:bg-[#2a3942]/10 transition-all flex items-center justify-between">
                    <div className="space-y-2">
                      <h4 className="font-black text-white text-xl tracking-tighter uppercase">{order.productName}</h4>
                      <p className="text-[10px] text-gray-500 font-mono">Estado: 
                        <span className={`ml-2 px-2 py-0.5 rounded uppercase ${
                          order.status === 'PENDING' ? 'text-amber-500' :
                          order.status === 'ACCEPTED' ? 'text-[#00ff7f]' : 'text-sky-500'
                        }`}>{order.status}</span>
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      {order.status === 'PENDING' && (
                        <button 
                          onClick={() => onUpdateOrder(order.id, 'ACCEPTED')}
                          className="px-6 py-3 bg-[#00ff7f] text-[#0b141a] text-[9px] rounded-xl font-black uppercase tracking-widest"
                        >
                          Atender Pedido
                        </button>
                      )}
                      {order.status === 'ACCEPTED' && (
                        <button 
                          onClick={() => onUpdateOrder(order.id, 'READY')}
                          className="px-6 py-3 bg-white text-[#0b141a] text-[9px] rounded-xl font-black uppercase tracking-widest border-2 border-white hover:bg-transparent hover:text-white transition-all text-center leading-tight"
                        >
                          Su pedido está listo,<br/>Retirarlo por {user.storeName}
                        </button>
                      )}
                      {order.status === 'READY' && (
                        <span className="text-[9px] font-black text-[#00ff7f] uppercase bg-[#00ff7f]/10 px-4 py-2 rounded-xl text-center">
                          Notificación Enviada
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111b21] rounded-[2.5rem] border border-gray-800 p-8 shadow-xl">
             <div className="flex justify-between items-center mb-8">
              <h2 className="text-lg font-black text-[#00ff7f] uppercase tracking-widest">Inventario</h2>
              <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`p-3.5 rounded-xl transition-all ${isAdding ? 'bg-rose-500 text-white' : 'bg-[#2a3942] text-[#00ff7f]'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d={isAdding ? "M6 18L18 6M6 6l12 12" : "M12 4v16m8-8H4"} /></svg>
              </button>
            </div>

            {isAdding && (
              <form onSubmit={handleSubmitProduct} className="mb-8 p-6 bg-[#0b141a] rounded-[2rem] space-y-5 border border-gray-800">
                <input 
                  required placeholder="Nombre Producto" 
                  value={newProd.name} onChange={e => setNewProd({...newProd, name: e.target.value})}
                  className="w-full text-sm p-4 rounded-2xl bg-[#2a3942] border-none text-white outline-none focus:ring-1 focus:ring-[#00ff7f] font-bold" 
                />
                <div className="flex gap-2">
                  <input required type="number" step="0.01" placeholder={`Precio ${settings.currency}`} value={newProd.price} onChange={e => setNewProd({...newProd, price: e.target.value})} className="w-1/2 p-4 rounded-2xl bg-[#2a3942] border-none text-white outline-none font-bold" />
                  <input required type="number" placeholder="Unidades" value={newProd.stock} onChange={e => setNewProd({...newProd, stock: e.target.value})} className="w-1/2 p-4 rounded-2xl bg-[#2a3942] border-none text-white outline-none font-bold" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#00ff7f] text-[#0b141a] rounded-2xl text-[9px] font-black uppercase tracking-widest">Añadir Stock</button>
              </form>
            )}

            <div className="space-y-4">
              {products.map(product => (
                <div key={product.id} className="p-5 rounded-[1.5rem] bg-[#0b141a] border border-gray-800 flex justify-between items-center group hover:border-[#00ff7f]/50 transition-all">
                  <div className="flex-1">
                    <h4 className="text-sm font-black text-gray-200 tracking-tight uppercase">{product.name}</h4>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-[#00ff7f] tracking-tighter">{product.price.toFixed(2)}{product.currency}</div>
                    <div className="text-[9px] font-black text-gray-700 uppercase">{product.stock} DISP.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
