import ProductoDetalle from '../../types/IProductoDetalle';
import ProductoDetallePost from '../../types/post/ProductoDetallePost';

import { createGenericSlice } from './GenericReducer';

const productoDetalleSlice = createGenericSlice<ProductoDetalle| ProductoDetallePost[]>('productoDetalleState', { data: [] });

export const { setData: setProductoDetalle, resetData: resetProductoDetalle } = productoDetalleSlice.actions;

export default productoDetalleSlice.reducer;