import { useState, useEffect } from 'react';
import { getMisDatos, eliminarMiCuenta } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MisDatos.css';

function Fila({ label, value }) {
    return (
        <div className="datos-fila">
            <span className="datos-label">{label}</span>
            <span className="datos-value">{value ?? '—'}</span>
        </div>
    );
}

function Seccion({ titulo, icono, children }) {
    return (
        <div className="datos-seccion">
            <div className="datos-seccion-titulo">{icono} {titulo}</div>
            {children}
        </div>
    );
}

export default function MisDatos({ onClose, onCuentaEliminada }) {
    const { token, logout } = useAuth();
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmacion, setConfirmacion] = useState('');
    const [bajando, setBajando] = useState(false);

    useEffect(() => {
        if (!token) return;
        getMisDatos(token)
            .then(setDatos)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [token]);

    const handleExportar = async () => {
        try {
            const res = await fetch('/api/usuarios/me/exportar', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'mis_datos.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch {
            alert('Error al exportar datos');
        }
    };

    const handleEliminar = async () => {
        if (confirmacion !== 'ELIMINAR') return;
        setBajando(true);
        try {
            await eliminarMiCuenta(token);
            alert('Tu cuenta fue eliminada. Los datos personales fueron anonimizados. Tu historial de compras se conserva por obligación legal.');
            logout();
            if (onCuentaEliminada) onCuentaEliminada();
            onClose();
        } catch (e) {
            alert('Error al eliminar la cuenta: ' + e.message);
        } finally {
            setBajando(false);
        }
    };

    const puedeEliminar = confirmacion === 'ELIMINAR';

    return (
        <div className="mis-datos-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="mis-datos-modal">
                <div className="md-header">
                    <div>
                        <h2 className="md-title">👤 Mis Datos</h2>
                        <p className="md-subtitle">Tus datos personales almacenados — Ley 25.326</p>
                    </div>
                    <button className="md-close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="md-body">
                    {loading && <div className="md-loading"><div className="spinner" /> Cargando datos...</div>}
                    {error && <div className="md-error">⚠️ {error}</div>}

                    {datos && (
                        <>
                            {/* Perfil */}
                            <Seccion titulo="Información de cuenta" icono="🪪">
                                <Fila label="Nombre" value={datos.perfil.nombre} />
                                <Fila label="Email" value={datos.perfil.email} />
                                <Fila 
                                    label="Rol de Usuario" 
                                    value={
                                        datos.perfil.rol === 'admin' ? (
                                            <span className="rol-badge rol-admin">👑 Administradora (admin)</span>
                                        ) : (
                                            <span className="rol-badge rol-customer">👤 Cliente ({datos.perfil.rol || 'customer'})</span>
                                        )
                                    } 
                                />
                                <Fila label="Estado de cuenta" value={datos.perfil.activo ? '🟢 Activo' : '🔴 Inactivo'} />
                                <Fila label="Aceptó tratamiento de datos"
                                      value={datos.perfil.acepto_tratamiento ? '✅ Sí' : '❌ No'} />
                                <Fila label="Fecha de consentimiento"
                                      value={datos.perfil.fecha_consentimiento
                                          ? new Date(datos.perfil.fecha_consentimiento).toLocaleString('es-AR')
                                          : null} />
                            </Seccion>

                            {/* Estadísticas */}
                            <Seccion titulo="Actividad" icono="📊">
                                <div className="stats-grid">
                                    <div className="stat-card stat-blue">
                                        <div className="stat-num">{datos.pedidos.length}</div>
                                        <div className="stat-label">Compras</div>
                                    </div>
                                    <div className="stat-card stat-green">
                                        <div className="stat-num">
                                            ${datos.pedidos.reduce((s, p) => s + parseFloat(p.total), 0).toLocaleString('es-AR')}
                                        </div>
                                        <div className="stat-label">Total gastado</div>
                                    </div>
                                    <div className="stat-card stat-orange">
                                        <div className="stat-num">{datos.solicitudes_revocacion.length}</div>
                                        <div className="stat-label">Revocaciones</div>
                                    </div>
                                </div>
                            </Seccion>

                            {/* Exportar */}
                            <Seccion titulo="Portabilidad de datos" icono="📤">
                                <p className="portabilidad-info">
                                    Tenés derecho a llevarte todos tus datos personales (Art. 14, Ley 25.326).
                                    El archivo incluye tu perfil, tus compras y tus solicitudes de revocación.
                                </p>
                                <button className="btn-exportar" onClick={handleExportar}>
                                    ⬇️ Descargar mis datos (.json)
                                </button>
                            </Seccion>

                            {/* Baja de cuenta */}
                            <Seccion titulo="Eliminar mi cuenta" icono="🗑️">
                                <div className="baja-advertencia">
                                    <p><strong>¿Qué se borra?</strong></p>
                                    <ul>
                                        <li>✅ Tu nombre y email serán <strong>anonimizados</strong></li>
                                        <li>✅ Tu contraseña será eliminada</li>
                                        <li>⚠️ El historial de compras se conserva por obligación legal</li>
                                        <li>⚠️ Esta acción es <strong>irreversible</strong></li>
                                    </ul>
                                </div>
                                <div className="baja-confirm">
                                    <label className="baja-label">
                                        Para confirmar, escribí <strong>ELIMINAR</strong> en el campo:
                                    </label>
                                    <input
                                        type="text"
                                        className={`baja-input ${puedeEliminar ? 'input-valid' : ''}`}
                                        placeholder="Escribí ELIMINAR"
                                        value={confirmacion}
                                        onChange={e => setConfirmacion(e.target.value)}
                                    />
                                    <button
                                        className="btn-baja"
                                        disabled={!puedeEliminar || bajando}
                                        onClick={handleEliminar}
                                    >
                                        {bajando ? 'Procesando...' : '🗑️ Eliminar mi cuenta definitivamente'}
                                    </button>
                                </div>
                            </Seccion>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
