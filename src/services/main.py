# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

app = FastAPI(title="El rincón de los postres")

# Paso 1: El modelo Producto con Pydantic
class Producto(BaseModel):
    id: int
    nombre: str
    precio_final: float
    cuotas_cantidad: int
    cuotas_valor: float
    garantia_meses: int
    stock: int


productos_db = [
    Producto(
        id=1,
        nombre="Esponja(bizcochuelo)",
        precio_final=11500,
        cuotas_cantidad=3,
        cuotas_valor=3833.33,
        garantia_meses=0,
        stock=15
    ),
    Producto(
        id=2,
        nombre="hamburguesa(postre de banana)",
        precio_final=9500,
        cuotas_cantidad=3,
        cuotas_valor=3166.67,
        garantia_meses=0,
        stock=8
    ),
    Producto(
        id=3,
        nombre="tomates(macarrones)",
        precio_final=11000,
        cuotas_cantidad=3,
        cuotas_valor=3666.67,
        garantia_meses=0,
        stock=3
    )
]

# Paso 3: Endpoint GET /productos
@app.get("/productos", response_model=list[Producto])
def obtener_productos():
    return productos_db

# Paso 4: Endpoint POST /productos
@app.post("/productos", response_model=Producto)
def crear_producto(producto: Producto):
    productos_db.append(producto)
    return producto