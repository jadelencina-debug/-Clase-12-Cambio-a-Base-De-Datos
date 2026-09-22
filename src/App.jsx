import { useState } from 'react';
import './App.css';
import Catalog from './components/Catalog';
import CartSidebar from './components/CartSidebar';
import PaymentModal from './components/PaymentModal';
import Ticket from './components/Ticket';
import BotonArrepentimiento from './components/BotonArrepentimiento';
import ModalAuth from './components/ModalAuth';

function createTicketData(cart, totalPrice, metodoPago) {
  const now = new Date();
  const fecha = now.toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  const numeroOrden = Math.floor(100000 + Math.random() * 900000);

  return {
    numeroOrden,
    fecha,
    metodoPago,
    items: cart,
    total: totalPrice,
  };
}

function App() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

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
    setTicket(createTicketData(cart, totalPrice, metodoPago));
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

      <BotonArrepentimiento ultimaOrden={ticket} />

      {/* Botón flotante — Demo Auth / Ley 25.326 */}
      <button
        className="auth-fab"
        onClick={() => setShowAuth(true)}
        id="auth-fab-btn"
        title="Demo: Autenticación y Ley 25.326"
        aria-label="Abrir demo de autenticación"
      >
        <span className="auth-fab-icon">🔐</span>
        <span className="auth-fab-label">Auth / Ley 25.326</span>
      </button>

      {showAuth && <ModalAuth onClose={() => setShowAuth(false)} />}
    </>
  );
}

export default App;
