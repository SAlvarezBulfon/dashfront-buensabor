import { configureStore } from '@reduxjs/toolkit'
import EmpresaReducer from '../slices/EmpresaReducer'
import LocalidadReducer from '../slices/LocalidadReducer'
import ProvinciaReducer from '../slices/ProvinciaReducer'
import ModalReducer from '../slices/ModalReducer'
import PaisReducer from '../slices/PaisReducer'
import SucursalReducer from '../slices/SucursalReducer'
import InsumosReducer from '../slices/InsumosReducer'
import ProductoReducer from '../slices/ProductoReducer'
import ProductoDetalleReducer from '../slices/ProductoDetalleReducer'
import CategoriaReducer from '../slices/CategoriaReducer'
import PromocionReducer from '../slices/PromocionReducer'
import EmpleadoReducer from '../slices/EmpleadoReducer'


export const store = configureStore({
  reducer: {
    empresa:EmpresaReducer,
    localidad: LocalidadReducer,
    provincia: ProvinciaReducer,
    pais: PaisReducer,
    modal: ModalReducer,
    sucursal: SucursalReducer,
    insumo: InsumosReducer,
    producto: ProductoReducer,
    productoDetalle: ProductoDetalleReducer,
    categoria: CategoriaReducer,
    promocion: PromocionReducer,
    empleado: EmpleadoReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch