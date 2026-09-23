import './Arrepentimiento.css';

export default function PaginaArrepentimiento({ onVolver }) {
    return (
        <div className="arrep-page">
            <div className="arrep-container">
                <button className="arrep-volver" onClick={onVolver}>← Volver al catálogo</button>

                <div className="arrep-hero">
                    <div className="arrep-icon">↩️</div>
                    <h1>Derecho a Arrepentimiento</h1>
                    <p className="arrep-hero-sub">Tu derecho está protegido por la Ley 24.240 y la Disposición 954/2025</p>
                </div>

                <div className="arrep-cards-grid">
                    <div className="arrep-card arrep-card-blue">
                        <div className="arrep-card-icon">⏳</div>
                        <h3>¿Cuánto tiempo tenés?</h3>
                        <p>Tenés <strong>10 días corridos</strong> desde que recibiste el producto o contrataste el servicio para ejercer este derecho.</p>
                    </div>

                    <div className="arrep-card arrep-card-green">
                        <div className="arrep-card-icon">💸</div>
                        <h3>¿Tiene algún costo?</h3>
                        <p>No. El arrepentimiento es <strong>completamente gratuito</strong>. Los gastos de devolución del producto corren por cuenta del vendedor.</p>
                    </div>

                    <div className="arrep-card arrep-card-purple">
                        <div className="arrep-card-icon">📦</div>
                        <h3>¿Cómo lo ejercés?</h3>
                        <p>Ingresá a <strong>Mis Compras</strong> en tu cuenta y hacé clic en el botón "Arrepentirme de esta compra" del pedido correspondiente.</p>
                    </div>

                    <div className="arrep-card arrep-card-orange">
                        <div className="arrep-card-icon">🔄</div>
                        <h3>¿Qué pasa con el stock?</h3>
                        <p>Al revocar tu compra, el stock del producto se repone automáticamente y el pedido queda marcado como <strong>cancelado</strong>.</p>
                    </div>
                </div>

                <div className="arrep-proceso">
                    <h2>¿Cómo funciona el proceso?</h2>
                    <div className="arrep-steps">
                        <div className="arrep-step">
                            <div className="arrep-step-num">1</div>
                            <div>
                                <strong>Iniciá sesión</strong>
                                <p>Accedé a tu cuenta con tu email y contraseña.</p>
                            </div>
                        </div>
                        <div className="arrep-step">
                            <div className="arrep-step-num">2</div>
                            <div>
                                <strong>Abrí "Mis Compras"</strong>
                                <p>Encontrá el pedido del que querés arrepentirte.</p>
                            </div>
                        </div>
                        <div className="arrep-step">
                            <div className="arrep-step-num">3</div>
                            <div>
                                <strong>Confirmá la revocación</strong>
                                <p>Hacé clic en el botón de arrepentimiento. El sistema te dará un código de confirmación.</p>
                            </div>
                        </div>
                        <div className="arrep-step">
                            <div className="arrep-step-num">4</div>
                            <div>
                                <strong>Guardá el código</strong>
                                <p>Recibirás un código único (ej: ARR-20250923-A1B2C3) como comprobante de tu solicitud.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="arrep-legal">
                    <h3>🏛️ Marco Legal</h3>
                    <ul>
                        <li><strong>Ley 24.240</strong> — Defensa del Consumidor (Art. 34 - Venta a Distancia)</li>
                        <li><strong>Disposición 954/2025</strong> — Botón de Arrepentimiento en comercio electrónico</li>
                        <li><strong>Disposición 3/2026</strong> — Actualización del proceso de revocación digital</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
