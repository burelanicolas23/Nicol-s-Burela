
import React, { useState, useEffect, useMemo } from 'react';
import { User, Product, Order } from '../types';

interface CustomerDashboardProps {
  user: User;
  products: Product[];
  orders: Order[];
  onPlaceOrder: (order: Order) => void;
}

const CustomerDashboard: React.FC<CustomerDashboardProps> = ({ user, products, orders, onPlaceOrder }) => {
  const [filter, setFilter] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [notifications, setNotifications] = useState<{id: string, msg: string}[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.warn("Geo denied", err)
      );
    }
  }, []);

  // Notificaciones de cambio de estado
  useEffect(() => {
    orders.forEach(order => {
      if (order.status !== 'PENDING') {
        const elapsed = (Date.now() - order.createdAt) / 60000;
        const remaining = Math.max(0, Math.ceil(order.estimatedMinutes - elapsed));
        
        let msg = '';
        if (order.status === 'ACCEPTED') {
          msg = `📦 ${order.productName} en marcha. Falta aprox: ${remaining} min.`;
        } else if (order.status === 'READY') {
          msg = `✅ ¡TU PEDIDO DE ${order.productName} ESTÁ LISTO! Pásate a recogerlo.`;
        }

        const msgId = `${order.id}-${order.status}`;
        if (msg && !notifications.find(n => n.id === msgId)) {
          setNotifications(prev => [{id: msgId, msg}, ...prev].slice(0, 3));
          new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3').play().catch(() => {});
          setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== msgId)), 8000);
        }
      }
    });
  }, [orders]);

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map(p => p.category)))], [products]);
  
  const activeOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'ACCEPTED');
  const historyOrders = orders.filter(o => o.status === 'READY' || o.status === 'COMPLETED');

  const handleBuy = (product: Product) => {
    onPlaceOrder({
      id: Math.random().toString(36).substr(2, 9),
      customerId: user.id,
      merchantId: product.merchantId,
      productId: product.id,
      productName: product.name,
      status: 'PENDING',
      estimatedMinutes: (user.basePrepTime || 5) + product.prepTimeAdjustment,
      createdAt: Date.now(),
      type: 'PICKUP'
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="fixed top-20 right-4 z-[60] space-y-3 pointer-events-none w-80">
        {notifications.map((note) => (
          <div key={note.id} className="bg-[#00ff7f] text-[#0b141a] px-6 py-4 rounded-2xl shadow-2xl font-black text-xs uppercase tracking-widest animate-in slide-in-from-right-full duration-500 border border-white/20 backdrop-blur-md">
            {note.msg}
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Bienvenido, <span className="text-[#00ff7f]">{user.name}</span>
          </h1>
          <p className="text-gray-500 text-lg font-medium">¿Listo para conseguir algo al instante?</p>
        </div>
        <div className="w-full md:w-auto">
          <input 
            type="text" placeholder="Buscar..." value={filter} onChange={e => setFilter(e.target.value)}
            className="w-full md:w-80 pl-6 pr-4 py-4 bg-[#111b21] border border-gray-800 rounded-2xl text-white font-bold outline-none focus:ring-2 focus:ring-[#00ff7f]"
          />
        </div>
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-4 no-scrollbar">
        {categories.map(cat => (
          <button 
            key={cat} onClick={() => setSelectedCategory(cat)}
            className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
              selectedCategory === cat ? 'bg-[#00ff7f] text-[#0b141a] border-[#00ff7f]' : 'bg-[#111b21] text-gray-500 border-gray-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.filter(p => filter === '' || p.name.toLowerCase().includes(filter.toLowerCase())).map(product => (
          <div key={product.id} className="bg-[#111b21] rounded-[2.5rem] border-2 border-gray-800 p-8 flex flex-col justify-between hover:border-[#00ff7f] transition-all">
            <div>
              <h3 className="font-black text-white text-2xl mb-1 uppercase tracking-tighter">{product.name}</h3>
              <p className="text-[10px] font-black text-[#00ff7f] uppercase tracking-widest mb-4">{product.merchantName}</p>
            </div>
            <div className="pt-6 border-t border-gray-800 flex flex-col gap-5">
              <div className="flex justify-between items-end">
                <span className="text-2xl font-black text-white">{product.price.toFixed(2)}{product.currency}</span>
                <span className="text-[9px] font-black text-[#00ff7f] uppercase">{product.stock} DISP.</span>
              </div>
              <button onClick={() => handleBuy(product)} className="w-full py-4 bg-[#00ff7f] text-[#0b141a] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110">
                Pedir Ahora
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeOrders.length > 0 && (
        <div className="mt-20 bg-[#111b21] rounded-[3.5rem] p-12 border-2 border-[#00ff7f]/30 shadow-2xl">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase mb-8">Pedidos Activos 🚀</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeOrders.map(order => {
              const elapsed = (Date.now() - order.createdAt) / 60000;
              const remaining = Math.max(0, Math.ceil(order.estimatedMinutes - elapsed));
              return (
                <div key={order.id} className="bg-[#0b141a] border border-gray-800 p-8 rounded-[2rem]">
                  <h4 className="font-black text-xl text-white uppercase mb-2">{order.productName}</h4>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="text-amber-500">{order.status}</span>
                    <span className="text-gray-500">{remaining} MIN RESTANTES</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {historyOrders.length > 0 && (
        <div className="mt-12 bg-[#111b21] rounded-[3.5rem] p-12 border border-gray-800">
          <h2 className="text-2xl font-black text-gray-500 tracking-tighter uppercase mb-8">Historial de Pedidos 📜</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyOrders.map(order => (
              <div key={order.id} className="bg-[#0b141a]/50 border border-gray-800 p-6 rounded-[2rem] opacity-70">
                <h4 className="font-black text-lg text-gray-400 uppercase mb-2">{order.productName}</h4>
                <div className="flex justify-between items-center text-[9px] font-black uppercase">
                  <span className="text-[#00ff7f]">COMPLETADO</span>
                  <span className="text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
