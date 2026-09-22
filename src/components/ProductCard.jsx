import { getProductImage } from '../utils/productImages';

export default function ProductCard({ producto, addToCart, cart }) {
    const { nombre, precio_final, cuotas_cantidad, cuotas_valor, garantia_meses, stock } = producto;
    const inCart = cart?.find((item) => item.id === producto.id);
    const cantidadEnCarrito = inCart ? inCart.cantidad : 0;
    const sinStock = cantidadEnCarrito >= stock;
    const imgSrc = getProductImage(producto);

    return (
        <div className="card">
            {imgSrc && (
                <div className="card-img-wrapper">
                    <img src={imgSrc} alt={nombre} className="card-img" />
                </div>
            )}
            <h3>{nombre}</h3>
            <p className="precio">${precio_final.toLocaleString('es-AR')}</p>
            <p className="cuotas">
                {cuotas_cantidad} cuotas de ${cuotas_valor.toLocaleString('es-AR')}
            </p>
            {garantia_meses > 0 && (
                <p className="garantia">Garantía: {garantia_meses} meses</p>
            )}
            <p className="stock-info">Stock: {stock - cantidadEnCarrito} disponibles</p>
            <button
                className={`add-to-cart-btn ${sinStock ? 'add-to-cart-btn--disabled' : ''}`}
                onClick={() => !sinStock && addToCart(producto)}
                disabled={sinStock}
                id={`add-to-cart-${producto.id}`}
            >
                {sinStock ? 'Sin stock' : cantidadEnCarrito > 0 ? `Agregar más (${cantidadEnCarrito})` : 'Agregar al carrito'}
            </button>
        </div>
    );
}