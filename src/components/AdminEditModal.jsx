import { useState } from 'react';
import { updateProducto, uploadProductoImagen, createProducto, deleteProducto } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AdminEditModal.css';

export default function AdminEditModal({ producto, onClose, onSaved }) {
    const { token } = useAuth();
    const isEditing = Boolean(producto && producto.id);

    const [nombre, setNombre] = useState(producto?.nombre || '');
    const [precioFinal, setPrecioFinal] = useState(producto?.precio_final || 1000);
    const [cuotasCantidad, setCuotasCantidad] = useState(producto?.cuotas_cantidad || 6);
    const [cuotasValor, setCuotasValor] = useState(producto?.cuotas_valor || Math.round((producto?.precio_final || 1000) / 6));
    const [garantiaMeses, setGarantiaMeses] = useState(producto?.garantia_meses || 12);
    const [stock, setStock] = useState(producto?.stock || 10);
    const [imagenArchivo, setImagenArchivo] = useState(null);

    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });

    // Autocalcular valor de cuota si cambia precio
    const handlePrecioChange = (val) => {
        const num = parseFloat(val) || 0;
        setPrecioFinal(num);
        if (cuotasCantidad > 0) {
            setCuotasValor(Math.round(num / cuotasCantidad));
        }
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        try {
            const payload = {
                nombre,
                precio_final: parseFloat(precioFinal),
                cuotas_cantidad: parseInt(cuotasCantidad),
                cuotas_valor: parseFloat(cuotasValor),
                garantia_meses: parseInt(garantiaMeses),
                stock: parseInt(stock),
            };

            let prodResultado = null;

            if (isEditing) {
                prodResultado = await updateProducto(producto.id, payload, token);
                setMsg({ type: 'success', text: '✅ Producto actualizado correctamente.' });
            } else {
                prodResultado = await createProducto(payload, token);
                setMsg({ type: 'success', text: '✅ Producto creado correctamente.' });
            }

            // Si hay un archivo de imagen seleccionado, subirlo
            if (imagenArchivo && prodResultado && prodResultado.id) {
                setMsg({ type: 'info', text: '📷 Subiendo imagen y verificando seguridad (Magic Bytes)...' });
                await uploadProductoImagen(prodResultado.id, imagenArchivo, token);
                setMsg({ type: 'success', text: '✅ ¡Producto e imagen actualizados exitosamente!' });
            }

            setTimeout(() => {
                if (onSaved) onSaved();
                onClose();
            }, 1200);
        } catch (err) {
            setMsg({ type: 'error', text: '❌ Error: ' + err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async () => {
        if (!window.confirm(`¿Estás seguro de eliminar el producto "${nombre}"?`)) return;
        setLoading(true);
        try {
            await deleteProducto(producto.id, token);
            alert('Producto eliminado');
            if (onSaved) onSaved();
            onClose();
        } catch (err) {
            alert('Error al eliminar: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="admin-modal">
                <div className="admin-modal-header">
                    <h2>👑 {isEditing ? `Editar Producto #${producto.id}` : 'Crear Nuevo Producto'}</h2>
                    <button className="admin-modal-close" onClick={onClose}>✕</button>
                </div>

                <form className="admin-modal-body" onSubmit={handleGuardar}>
                    {msg.text && (
                        <div className={`admin-msg ${msg.type}`}>
                            {msg.text}
                        </div>
                    )}

                    <div className="admin-form-group">
                        <label>Nombre del Producto</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={e => setNombre(e.target.value)}
                            placeholder="Ej. Hamburguesa Deluxe"
                            required
                        />
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Precio Final ($ ARS)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={precioFinal}
                                onChange={e => handlePrecioChange(e.target.value)}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Stock Disponible</label>
                            <input
                                type="number"
                                value={stock}
                                onChange={e => setStock(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-row">
                        <div className="admin-form-group">
                            <label>Cuotas (Cantidad)</label>
                            <input
                                type="number"
                                value={cuotasCantidad}
                                onChange={e => setCuotasCantidad(e.target.value)}
                                required
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Valor de Cuota ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={cuotasValor}
                                onChange={e => setCuotasValor(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="admin-form-group">
                        <label>Garantía (Meses)</label>
                        <input
                            type="number"
                            value={garantiaMeses}
                            onChange={e => setGarantiaMeses(e.target.value)}
                            required
                        />
                    </div>

                    <div className="admin-form-group admin-file-box">
                        <label>🖼️ Subir Nueva Imagen (JPEG, PNG, WebP, GIF)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setImagenArchivo(e.target.files[0])}
                        />
                        <span className="file-hint">
                            * Se verifica mediante Magic Bytes reales del archivo para mayor seguridad.
                        </span>
                    </div>

                    <div className="admin-modal-actions">
                        {isEditing && (
                            <button
                                type="button"
                                className="btn-admin-delete"
                                onClick={handleEliminar}
                                disabled={loading}
                            >
                                🗑️ Eliminar
                            </button>
                        )}
                        <button
                            type="submit"
                            className="btn-admin-save"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : '💾 Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
