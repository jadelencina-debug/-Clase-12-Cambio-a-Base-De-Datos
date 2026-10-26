import { useState, useEffect } from 'react';
import { getProductos } from '../services/api';
import ProductCard from './ProductCard';

export default function Catalog({ addToCart, cart, isAdmin, onEditProducto, onCrearProducto, refreshKey }) {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [lento, setLento] = useState(false);

    useEffect(() => {
        if (!cargando) {
            setLento(false);
            return;
        }
        const t = setTimeout(() => setLento(true), 5000);
        return () => clearTimeout(t);
    }, [cargando]);

    const cargarProductos = () => {
        setCargando(true);
        getProductos()
            .then((data) => setProductos(data))
            .catch((error) => console.error(error))
            .finally(() => setCargando(false));
    };

    useEffect(() => {
        cargarProductos();
    }, [refreshKey]);

    return (
        <div className="catalogo">
            <h1>Catálogo de Productos</h1>
            
            {cargando && (
                <p role="status">
                    {lento
                        ? "Despertando el servidor, la primera visita puede tardar un minuto…"
                        : "Cargando productos…"}
                </p>
            )}

            {isAdmin && (
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <button
                        onClick={onCrearProducto}
                        style={{
                            padding: '0.75rem 1.4rem',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'transform 0.2s'
                        }}
                    >
                        ➕ Crear Nuevo Producto
                    </button>
                </div>
            )}

            <div className="grid-productos">
                {productos.map((prod) => (
                    <ProductCard
                        key={prod.id}
                        producto={prod}
                        addToCart={addToCart}
                        cart={cart}
                        isAdmin={isAdmin}
                        onEditProducto={onEditProducto}
                    />
                ))}
            </div>
        </div>
    );
}
