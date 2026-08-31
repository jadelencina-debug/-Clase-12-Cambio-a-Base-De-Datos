// src/components/ProductCard.jsx

export default function ProductCard({ producto }) {
    const { nombre, precio_final, cuotas_cantidad, cuotas_valor, garantia_meses } = producto;

    return (
        <div className="card">
            <h3>{nombre}</h3>
            <p className="precio">Precio: ${precio_final}</p>
            <p className="cuotas">
                {cuotas_cantidad} cuotas de ${cuotas_valor}
            </p>
            <p className="garantia">Garantía: {garantia_meses} meses</p>
        </div>
    );
}