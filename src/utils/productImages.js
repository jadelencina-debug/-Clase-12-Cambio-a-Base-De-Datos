export const PRODUCT_IMAGES = {
    1: '/images/hamburguesa.png',
    2: '/images/esponja.png',
    3: '/images/huevo.png',
    4: '/images/velas.png',
    5: '/images/tomates.png',
};

export function getProductImage(producto) {
    if (!producto) return null;
    if (producto.imagen) return producto.imagen;
    if (PRODUCT_IMAGES[producto.id]) return PRODUCT_IMAGES[producto.id];
    const n = (producto.nombre || '').toLowerCase();
    if (n.includes('hamburguesa')) return '/images/hamburguesa.png';
    if (n.includes('esponja')) return '/images/esponja.png';
    if (n.includes('huevo')) return '/images/huevo.png';
    if (n.includes('vela')) return '/images/velas.png';
    if (n.includes('tomate')) return '/images/tomates.png';
    return null;
}
