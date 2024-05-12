import Sucursal from '../../types/ISucursal';
import SucursalPost from '../../types/post/SucursalPost';
import { createGenericSlice } from './GenericReducer';

const sucursalSlice = createGenericSlice<Sucursal[] | SucursalPost[]>('sucursalState', { data: [] });

export const { setData: setSucursal, resetData: resetSucursal } = sucursalSlice.actions;

export default sucursalSlice.reducer;