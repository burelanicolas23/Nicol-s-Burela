
import React, { useState, useEffect } from 'react';
import { User, UserRole, Product, Order } from './types';
import LoginView from './components/LoginView';
import MerchantDashboard from './components/MerchantDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      const initial: Product[] = [
        {
          id: '1',
          merchantId: 'm1',
          name: 'Café de Especialidad',
          price: 3.5,
          stock: 50,
          description: 'Granos recién molidos.',
          category: 'Bebidas',
          prepTimeAdjustment: 2,
          imageUrl: '',
          merchantName: 'La Tienda Local',
          merchantOpening: '08:00',
          merchantClosing: '22:00',
          currency: '€'
        },
        {
          id: '2',
          merchantId: 'm1',
          name: 'Croissant Artesanal',
          price: 2.2,
          stock: 20,
          description: 'Mantequilla pura, horneado hoy.',
          category: 'Pastelería',
          prepTimeAdjustment: 0,
          imageUrl: '',
          merchantName: 'La Tienda Local',
          merchantOpening: '08:00',
          merchantClosing: '22:00',
          currency: '€'
        }
      ];
      setProducts(initial);
      localStorage.setItem('products', JSON.stringify(initial));
    }

    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update merchant info in products for data consistency
    if (updatedUser.role === UserRole.MERCHANT) {
      const updatedProducts = products.map(p => 
        p.merchantId === updatedUser.id ? {
          ...p,
          merchantOpening: updatedUser.openingTime,
          merchantClosing: updatedUser.closingTime,
          merchantOpening2: updatedUser.openingTime2,
          merchantClosing2: updatedUser.closingTime2,
          merchantName: updatedUser.storeName,
          currency: updatedUser.currency
        } : p
      );
      setProducts(updatedProducts);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addProduct = (product: Product) => {
    const fullProduct = {
      ...product,
      merchantOpening: currentUser?.openingTime,
      merchantClosing: currentUser?.closingTime,
      merchantOpening2: currentUser?.openingTime2,
      merchantClosing2: currentUser?.closingTime2,
      merchantName: currentUser?.storeName,
      currency: currentUser?.currency
    };
    const updated = [...products, fullProduct];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const updateProduct = (updatedProduct: Product) => {
    const updated = products.map(p => p.id === updatedProduct.id ? updatedProduct : p);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  const placeOrder = (order: Order) => {
    const updated = [order, ...orders];
    setOrders(updated);
    const prod = products.find(p => p.id === order.productId);
    if (prod) {
      updateProduct({ ...prod, stock: prod.stock - 1 });
    }
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="min-h-screen bg-[#0b141a] flex flex-col">
      <Navbar user={currentUser} onLogout={handleLogout} />
      
      <main className="container mx-auto px-4 py-12 flex-grow max-w-7xl">
        {!currentUser ? (
          <LoginView onLogin={handleLogin} />
        ) : currentUser.role === UserRole.MERCHANT ? (
          <MerchantDashboard 
            user={currentUser} 
            products={products.filter(p => p.merchantId === currentUser.id)} 
            orders={orders.filter(o => o.merchantId === currentUser.id)}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onUpdateOrder={updateOrderStatus}
            onUpdateSettings={handleUpdateUser}
          />
        ) : (
          <CustomerDashboard 
            user={currentUser} 
            products={products} 
            orders={orders.filter(o => o.customerId === currentUser.id)}
            onPlaceOrder={placeOrder}
          />
        )}
      </main>

      <footer className="py-10 text-center text-gray-700 text-[10px] font-black uppercase tracking-[0.3em] border-t border-gray-900 bg-[#0b141a]">
        &copy; 2024 24Seven Connect • Red Global de Comercio 24h
      </footer>
    </div>
  );
};

export default App;
