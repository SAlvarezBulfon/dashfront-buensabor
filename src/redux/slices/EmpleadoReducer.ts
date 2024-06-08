import IEmpleado from '../../types/Empleado';
import { createGenericSlice } from './GenericReducer';

const empleadoSlice = createGenericSlice<IEmpleado[]>('empleadoState', { data: [] });

export const { setData: setEmpleado, resetData: resetEmpleado } = empleadoSlice.actions;

export default empleadoSlice.reducer;