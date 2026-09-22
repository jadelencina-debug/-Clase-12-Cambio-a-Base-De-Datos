import { getProductImage } from '../utils/productImages';

export default function CartSidebar({ cart, isOpen, onClose, onRemove, totalPrice, onCheckout }) {
    return (
        <>
            {/* Overlay oscuro */}
            <div
                className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`}
                onClick={onClose}
            />

            {/* Panel lateral */}
            <aside className={`cart-sidebar ${isOpen ? 'cart-sidebar--open' : ''}`} id="cart-sidebar">
                <div className="cart-header">
                    <h2>🛒 Tu Carrito</h2>
                    <button className="cart-close-btn" onClick={onClose} id="cart-close-btn">✕</button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <p className="cart-empty">Tu carrito está vacío.</p>
                    ) : (
                        cart.map((item) => {
                            const imgSrc = getProductImage(item);
                            return (
                                <div key={item.id} className="cart-item">
                                    {imgSrc && (
                                        <img src={imgSrc} alt={item.nombre} className="cart-item-thumb" />
                                    )}
                                    <div className="cart-item-info">
                                        <span className="cart-item-name">{item.nombre}</span>
                                        <span className="cart-item-qty">x{item.cantidad}</span>
                                    </div>
                                <div className="cart-item-right">
                                    <span className="cart-item-price">
                                        ${(item.precio_final * item.cantidad).toLocaleString('es-AR')}
                                    </span>
                                    <button
                                        className="cart-remove-btn"
                                        onClick={() => onRemove(item.id)}
                                        id={`cart-remove-${item.id}`}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            );
                        })
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <strong>${totalPrice.toLocaleString('es-AR')}</strong>
                        </div>
                        <button className="cart-checkout-btn" id="cart-checkout-btn" onClick={onCheckout}>
                            Confirmar Compra
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
