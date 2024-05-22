import Producto from '../../types/IProducto';
import { createGenericSlice } from './GenericReducer';

const productoSlice = createGenericSlice<Producto[]>('productoState', { data: [] });

export const { setData: setProducto, resetData: resetProducto } = productoSlice.actions;

export default productoSlice.reducer;