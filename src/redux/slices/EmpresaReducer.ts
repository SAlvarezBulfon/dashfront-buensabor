import Empresa from '../../types/IEmpresa';
import { createGenericSlice } from './GenericReducer';


// Creamos el slice específico para la entidad Empresa
const empresaSlice = createGenericSlice<Empresa[]>('empresaState', { data: [] });

// Exportamos las acciones específicas para el slice de empresa
export const { setData: setEmpresa, resetData: resetEmpresa } = empresaSlice.actions;

// Exportamos el reducer específico para el slice de empresa
export default empresaSlice.reducer;
