import { useState } from 'react';
import './App.css';
import Catalog from './components/Catalog';
import CartSidebar from './components/CartSidebar';
import PaymentModal from './components/PaymentModal';
import Ticket from './components/Ticket';

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [ticket, setTicket] = useState(null);

  const addToCart = (producto) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === producto.id);
      if (existing) {
        if (existing.cantidad >= producto.stock) return prev;
        return prev.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setShowPayment(true);
  };

  const handleConfirmPayment = (metodoPago) => {
    const now = new Date();
    const fecha = now.toLocaleDateString('es-AR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    const numeroOrden = Math.floor(100000 + Math.random() * 900000);

    setTicket({
      numeroOrden,
      fecha,
      metodoPago,
      items: cart,
      total: totalPrice,
    });
    setShowPayment(false);
    setCart([]);
  };

  const handleCloseTicket = () => setTicket(null);

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.precio_final * item.cantidad, 0);

  return (
    <>
      <main>
        <Catalog addToCart={addToCart} cart={cart} />
      </main>

      {/* Botón flotante del carrito */}
      <button className="cart-fab" onClick={() => setCartOpen(true)} id="cart-fab-btn">
        🛒
        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
      </button>

      <CartSidebar
        cart={cart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        totalPrice={totalPrice}
        onCheckout={handleCheckout}
      />

      {showPayment && (
        <PaymentModal
          cart={cart}
          totalPrice={totalPrice}
          onConfirm={handleConfirmPayment}
          onCancel={() => { setShowPayment(false); setCartOpen(true); }}
        />
      )}

      {ticket && <Ticket ticket={ticket} onClose={handleCloseTicket} />}
    </>
  );
}

export default App;
