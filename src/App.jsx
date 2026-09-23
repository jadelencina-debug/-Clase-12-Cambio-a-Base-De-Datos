import { useState, useEffect } from 'react';
import './App.css';
import Catalog from './components/Catalog';
import CartSidebar from './components/CartSidebar';
import PaymentModal from './components/PaymentModal';
import Ticket from './components/Ticket';
import BotonArrepentimiento from './components/BotonArrepentimiento';
import AuthScreen from './components/AuthScreen';
import MisPedidos from './components/MisPedidos';
import MisDatos from './components/MisDatos';
import PaginaArrepentimiento from './pages/Arrepentimiento';
import { useAuth } from './context/AuthContext';
import { createPedido } from './services/api';

function createTicketData(cart, totalPrice, metodoPago, backendPedido) {
  const now = new Date(backendPedido.creado_en || Date.now());
  const fecha = now.toLocaleDateString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
  const numeroOrden = backendPedido.id;

  return {
    numeroOrden,
    fecha,
    metodoPago,
    items: cart, // we keep the local cart objects to retain the names
    total: backendPedido.total || totalPrice,
  };
}

function App() {
  const { user, token, isGuest, loading, logout, loginAsGuest } = useAuth();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [showMisPedidos, setShowMisPedidos] = useState(false);
  const [showMisDatos, setShowMisDatos] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, forceUpdate] = useState(0);

  // Re-renderizar cuando cambie el hash (para la página de arrepentimiento)
  useEffect(() => {
    const handler = () => forceUpdate(n => n + 1);
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

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
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    if (!token) {
        alert("Debes iniciar sesión para finalizar la compra.");
        loginAsGuest(); // clears guest state and returns to login
        return;
    }
    setCartOpen(false);
    setShowPayment(true);
  };

  const handleConfirmPayment = async (metodoPago) => {
    setIsProcessing(true);
    try {
        const payload = cart.map(item => ({ producto_id: item.id, cantidad: item.cantidad }));
        const pedidoData = await createPedido(payload, token);
        setTicket(createTicketData(cart, totalPrice, metodoPago, pedidoData));
        setShowPayment(false);
        setCart([]); // Vacia el carrito después de compra exitosa
    } catch (error) {
        alert("Hubo un error al procesar el pedido: " + error.message);
    } finally {
        setIsProcessing(false);
    }
  };

  const handleCloseTicket = () => setTicket(null);

  const totalItems = cart.reduce((sum, item) => sum + item.cantidad, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.precio_final * item.cantidad, 0);

  if (loading) return <div style={{color:'white', padding: '2rem'}}>Cargando...</div>;

  if (!token && !isGuest) {
      return <AuthScreen />;
  }

  if (isGuest === false && !token) return <AuthScreen />;

  // Routing sencillo sin react-router
  if (window.location.hash === '#arrepentimiento') {
      return <PaginaArrepentimiento onVolver={() => { window.location.hash = ''; window.dispatchEvent(new HashChangeEvent('hashchange')); }} />;
  }

  return (
    <>
      <main>
        <Catalog addToCart={addToCart} cart={cart} />
      </main>

      {/* Footer con enlace legal */}
      <footer style={{
        textAlign: 'center', padding: '1rem',
        color: '#64748b', fontSize: '0.82rem',
        borderTop: '1px solid rgba(148,163,184,0.08)',
        marginTop: '2rem'
      }}>
        ¿Realizaste una compra? Conocé tu{' '}
        <a
          href="#arrepentimiento"
          style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 600 }}
          onClick={e => { e.preventDefault(); window.location.hash = 'arrepentimiento'; window.dispatchEvent(new HashChangeEvent('hashchange')); }}
        >
          Derecho a Arrepentimiento ↩️
        </a>{' '}(Ley 24.240)
      </footer>

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

      {showMisPedidos && (
        <MisPedidos
          onClose={() => setShowMisPedidos(false)}
          onOpenMisDatos={() => { setShowMisPedidos(false); setShowMisDatos(true); }}
        />
      )}

      {showMisDatos && (
        <MisDatos
          onClose={() => setShowMisDatos(false)}
          onCuentaEliminada={() => { setShowMisDatos(false); }}
        />
      )}

      {/* Floating Action Buttons */}
      <div className="fab-container" style={{ position: 'fixed', bottom: '20px', left: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {token && (
              <>
                <button
                  className="auth-fab"
                  onClick={() => setShowMisPedidos(true)}
                  style={{ background: '#1d4ed8', position: 'static' }}
                >
                  <span className="auth-fab-icon">📦</span>
                  <span className="auth-fab-label">Mis Compras</span>
                </button>
                <button
                  className="auth-fab"
                  onClick={() => setShowMisDatos(true)}
                  style={{ background: '#6d28d9', position: 'static' }}
                >
                  <span className="auth-fab-icon">👤</span>
                  <span className="auth-fab-label">Mis Datos</span>
                </button>
              </>
          )}
          <button
            className="auth-fab"
            onClick={() => {
                if (token) logout();
                else loginAsGuest(); // clears guest
            }}
            id="auth-fab-btn"
            title={token ? "Cerrar sesión" : "Iniciar sesión"}
            aria-label="Cerrar o iniciar sesión"
            style={{ position: 'static' }}
          >
            <span className="auth-fab-icon">{token ? '🚪' : '🔐'}</span>
            <span className="auth-fab-label">{token ? 'Cerrar sesión' : 'Login'}</span>
          </button>
      </div>
    </>
  );
}

export default App;
