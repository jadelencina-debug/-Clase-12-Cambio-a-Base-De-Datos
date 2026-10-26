const BASE_URL = import.meta.env.VITE_API_URL || '/api';

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

export const authLogin = async (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);
    const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
    });
    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.detail || "Error en inicio de sesión");
    }
    return body;
};

export const authRegister = async (userData) => {
    const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.detail || "Error en el registro");
    }
    return body;
};

export const getMe = async (token) => {
    const response = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.detail || "Error obteniendo usuario");
    }
    return body;
};

export const createPedido = async (items, token) => {
    // items must be { producto_id: x, cantidad: y }
    const response = await fetch(`${BASE_URL}/pedidos/`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ items }),
    });
    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.detail || "Error al crear el pedido");
    }
    return body;
};

export const getMisPedidos = async (token) => {
    const response = await fetch(`${BASE_URL}/pedidos/mios`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.detail || "Error al obtener historial de compras");
    }
    return body;
};

export const revocarPedido = async (pedidoId, token) => {
    const response = await fetch(`${BASE_URL}/pedidos/${pedidoId}/revocacion`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
    const body = await response.json();
    if (response.status === 409) throw new Error(body.detail || "No se puede revocar el pedido");
    if (response.status === 404) throw new Error("Pedido no encontrado");
    if (!response.ok) throw new Error(body.detail || "Error al revocar");
    return body;
};

export const getMisDatos = async (token) => {
    const response = await fetch(`${BASE_URL}/usuarios/me/datos`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.detail || "Error al obtener datos");
    return body;
};

export const eliminarMiCuenta = async (token) => {
    const response = await fetch(`${BASE_URL}/usuarios/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (response.status === 204) return true;
    const body = await response.json();
    throw new Error(body.detail || "Error al eliminar la cuenta");
};

// ── Servicios de Administración de Productos ──────────────────

export const updateProducto = async (id, data, token) => {
    const response = await fetch(`${BASE_URL}/productos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.detail || "Error al actualizar producto");
    return body;
};

export const createProducto = async (data, token) => {
    const response = await fetch(`${BASE_URL}/productos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.detail || "Error al crear producto");
    return body;
};

export const uploadProductoImagen = async (id, file, token) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${BASE_URL}/productos/${id}/imagen`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.detail || "Error al subir imagen");
    return body;
};

export const deleteProducto = async (id, token) => {
    const response = await fetch(`${BASE_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
    });
    if (response.status === 204) return true;
    const body = await response.json();
    throw new Error(body.detail || "Error al eliminar producto");
};
