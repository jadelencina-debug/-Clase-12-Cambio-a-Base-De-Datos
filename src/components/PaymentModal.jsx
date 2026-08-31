export default function PaymentModal({ cart, totalPrice, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" id="payment-modal-overlay">
            <div className="modal" id="payment-modal">
                <h2 className="modal-title">💳 Elegí tu método de pago</h2>
                <p className="modal-subtitle">Total a pagar: <strong>${totalPrice.toLocaleString('es-AR')}</strong></p>

                <div className="payment-options">
                    <button
                        className="payment-btn"
                        id="pay-efectivo"
                        onClick={() => onConfirm('Efectivo')}
                    >
                        💵 Efectivo
                    </button>
                    <button
                        className="payment-btn"
                        id="pay-credito"
                        onClick={() => onConfirm('Tarjeta de Crédito')}
                    >
                        💳 Tarjeta de Crédito
                    </button>
                    <button
                        className="payment-btn"
                        id="pay-debito"
                        onClick={() => onConfirm('Tarjeta de Débito')}
                    >
                        🏧 Tarjeta de Débito
                    </button>
                    <button
                        className="payment-btn"
                        id="pay-transferencia"
                        onClick={() => onConfirm('Transferencia Bancaria')}
                    >
                        🏦 Transferencia Bancaria
                    </button>
                </div>

                <button className="modal-cancel-btn" onClick={onCancel} id="payment-cancel-btn">
                    Cancelar
                </button>
            </div>
        </div>
    );
}
