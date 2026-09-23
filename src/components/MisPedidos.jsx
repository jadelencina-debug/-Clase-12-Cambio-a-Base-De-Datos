import { useState, useEffect } from 'react';
import { getMisPedidos, revocarPedido } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MisPedidos.css';

const DIAS_REVOCACION = 10;

function puedeRevocar(pedido) {
    if (pedido.estado === 'cancelado') return false;
    const creado = new Date(pedido.creado_en);
    const ahora = new Date();
    const diffMs = ahora - creado;
    const diffDias = diffMs / (1000 * 60 * 60 * 24);
    return diffDias <= DIAS_REVOCACION;
}

function formatearFecha(isoStr) {
    const d = new Date(isoStr);
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatearTotal(total) {
    const n = typeof total === 'string' ? parseFloat(total) : total;
    return n.toLocaleString('es-AR', { minimumFractionDigits: 0 });
}

const ESTADO_INFO = {
    pendiente: { emoji: '⏳', color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Pendiente' },
    cancelado:  { emoji: '🚫', color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'Cancelado' },
    pagado:     { emoji: '✅', color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Pagado'    },
    completado: { emoji: '✅', color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Completado'},
};

function EstadoBadge({ estado }) {
    const info = ESTADO_INFO[estado] || { emoji: '❓', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', label: estado };
    return (
        <span className="estado-pill" style={{ color: info.color, background: info.bg }}>
            {info.emoji} {info.label}
        </span>
    );
}

function PedidoCard({ pedido, onRevocar }) {
    const [expanded, setExpanded] = useState(false);
    const [revocarLoading, setRevocarLoading] = useState(false);
    const [codigoRev, setCodigoRev] = useState(null);
    const puedeRev = puedeRevocar(pedido);

    const handleRevocar = async () => {
        if (!window.confirm(`¿Querés cancelar el pedido #${pedido.id}? Esto devolverá el stock y el pedido quedará como "cancelado".`)) return;
        setRevocarLoading(true);
        try {
            const data = await onRevocar(pedido.id);
            setCodigoRev(data.codigo);
        } catch (e) {
            alert('Error al revocar: ' + e.message);
        } finally {
            setRevocarLoading(false);
        }
    };

    const totalItems = pedido.items.reduce((s, i) => s + i.cantidad, 0);

    return (
        <div className="pedido-card">
            {/* Header de la card */}
            <div className="pedido-card-header">
                <div className="pedido-card-id">
                    <span className="pedido-num">Orden #{pedido.id}</span>
                    <span className="pedido-fecha">📅 {formatearFecha(pedido.creado_en)}</span>
                </div>
                <div className="pedido-card-right">
                    <span className="pedido-total">${formatearTotal(pedido.total)}</span>
                    <EstadoBadge estado={pedido.estado} />
                </div>
            </div>

            {/* Resumen */}
            <div className="pedido-card-summary">
                <span className="pedido-items-count">🛍️ {totalItems} artículo{totalItems !== 1 ? 's' : ''}</span>
                <button className="btn-expand" onClick={() => setExpanded(e => !e)}>
                    {expanded ? '▲ Ocultar detalle' : '▼ Ver detalle'}
                </button>
            </div>

            {/* Detalle expandible */}
            {expanded && (
                <div className="pedido-detalle">
                    <div className="detalle-header">Detalle de ítems</div>
                    {pedido.items.map(item => (
                        <div key={item.id} className="detalle-item">
                            <span className="detalle-producto">Producto #{item.producto_id}</span>
                            <span className="detalle-cantidad">x{item.cantidad}</span>
                            <span className="detalle-precio">${parseFloat(item.precio_unitario).toLocaleString('es-AR')}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Botón de arrepentimiento */}
            {codigoRev ? (
                <div className="revocacion-exitosa" role="status">
                    ✅ Revocación registrada. Código: <strong>{codigoRev}</strong>
                </div>
            ) : puedeRev && pedido.estado !== 'cancelado' ? (
                <div className="revocacion-zona">
                    <div className="revocacion-info">
                        ℹ️ Tenés 10 días corridos para arrepentirte de tu compra (Ley 24.240)
                    </div>
                    <button className="btn-revocar" onClick={handleRevocar} disabled={revocarLoading}>
                        {revocarLoading ? 'Procesando...' : '↩️ Arrepentirme de esta compra'}
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default function MisPedidos({ onClose, onOpenMisDatos }) {
    const { token } = useAuth();
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const cargarPedidos = () => {
        if (!token) return;
        setLoading(true);
        getMisPedidos(token)
            .then(data => setPedidos(data))
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    };

    useEffect(cargarPedidos, [token]);

    const handleRevocar = async (pedidoId) => {
        const data = await revocarPedido(pedidoId, token);
        cargarPedidos(); // refrescar el historial
        return data;
    };

    return (
        <div className="mis-pedidos-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="mis-pedidos-modal">
                <div className="mp-header">
                    <div>
                        <h2 className="mp-title">📦 Mis Compras</h2>
                        <p className="mp-subtitle">Historial de tus pedidos</p>
                    </div>
                    <div className="mp-header-actions">
                        {onOpenMisDatos && (
                            <button className="btn-mis-datos" onClick={onOpenMisDatos} title="Ver y exportar mis datos personales">
                                👤 Mis Datos
                            </button>
                        )}
                        <button className="mp-close-btn" onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="mp-body">
                    {loading && (
                        <div className="mp-loading">
                            <div className="spinner" />
                            <p>Cargando historial...</p>
                        </div>
                    )}
                    {error && (
                        <div className="mp-error">
                            ⚠️ {error}
                        </div>
                    )}
                    {!loading && !error && pedidos.length === 0 && (
                        <div className="mp-empty">
                            <div className="mp-empty-icon">🛒</div>
                            <p>Todavía no realizaste ninguna compra.</p>
                            <p className="mp-empty-sub">¡Explorá el catálogo y encontrá algo que te guste!</p>
                        </div>
                    )}
                    {!loading && !error && pedidos.map(p => (
                        <PedidoCard key={p.id} pedido={p} onRevocar={handleRevocar} />
                    ))}
                </div>
            </div>
        </div>
    );
}
