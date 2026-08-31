const BASE_URL = '/api';

export const getProductos = async () => {
    try {
        const response = await fetch(`${BASE_URL}/productos`);
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        return [];
    }
};
