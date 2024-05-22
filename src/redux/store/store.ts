import { configureStore } from '@reduxjs/toolkit'
import EmpresaReducer from '../slices/EmpresaReducer'
import LocalidadReducer from '../slices/LocalidadReducer'
import ProvinciaReducer from '../slices/ProvinciaReducer'
import ModalReducer from '../slices/ModalReducer'
import PaisReducer from '../slices/PaisReducer'
import SucursalReducer from '../slices/SucursalReducer'
import InsumosReducer from '../slices/InsumosReducer'
import CategoriaReducer from '../slices/CategoriaReducer'

export const store = configureStore({
  reducer: {
    empresa:EmpresaReducer,
    localidad: LocalidadReducer,
    provincia: ProvinciaReducer,
    pais: PaisReducer,
    modal: ModalReducer,
    sucursal: SucursalReducer,
    insumo: InsumosReducer,
    categoria: CategoriaReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch