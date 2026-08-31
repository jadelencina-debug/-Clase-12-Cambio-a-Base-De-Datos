import { useState, useEffect } from 'react';
import { getProductos } from '../services/api';
import ProductCard from './ProductCard';

export default function Catalog() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        getProductos()
            .then((data) => setProductos(data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="catalogo">
            <h1>Catálogo de Productos</h1>
            <div className="grid-productos">
                {productos.map((prod) => (
                    <ProductCard key={prod.id} producto={prod} />
                ))}
            </div>
        </div>
    );
}