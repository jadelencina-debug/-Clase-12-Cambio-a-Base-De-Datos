export default function Ticket({ ticket, onClose }) {
    const handlePrint = () => window.print();

    return (
        <div className="modal-overlay" id="ticket-overlay">
            <div className="ticket-modal" id="ticket-modal">
                <div className="ticket-header">
                    <div className="ticket-logo">🛍️</div>
                    <h2>¡Compra confirmada!</h2>
                    <p className="ticket-subtitle">Gracias por tu compra</p>
                </div>

                <div className="ticket-body">
                    <div className="ticket-meta">
                        <div className="ticket-meta-row">
                            <span>Número de orden</span>
                            <strong>#{ticket.numeroOrden}</strong>
                        </div>
                        <div className="ticket-meta-row">
                            <span>Fecha</span>
                            <strong>{ticket.fecha}</strong>
                        </div>
                        <div className="ticket-meta-row">
                            <span>Método de pago</span>
                            <strong>{ticket.metodoPago}</strong>
                        </div>
                    </div>

                    <div className="ticket-divider">
                        <span>Detalle de la compra</span>
                    </div>

                    <div className="ticket-items">
                        {ticket.items.map((item) => (
                            <div key={item.id} className="ticket-item">
                                <span className="ticket-item-name">{item.nombre}</span>
                                <span className="ticket-item-qty">x{item.cantidad}</span>
                                <span className="ticket-item-price">
                                    ${(item.precio_final * item.cantidad).toLocaleString('es-AR')}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="ticket-total-row">
                        <span>TOTAL</span>
                        <strong>${ticket.total.toLocaleString('es-AR')}</strong>
                    </div>
                </div>

                <div className="ticket-footer">
                    <button className="ticket-print-btn" onClick={handlePrint} id="ticket-print-btn">
                        🖨️ Imprimir ticket
                    </button>
                    <button className="ticket-close-btn" onClick={onClose} id="ticket-close-btn">
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
