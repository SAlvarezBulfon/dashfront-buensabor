import Localidad from '../../types/ILocalidad';
import { createGenericSlice } from './GenericReducer';

const localidadSlice = createGenericSlice<Localidad[]>('localidadState', { data: [] });

export const { setData: setLocalidad, resetData: resetLocalidad } = localidadSlice.actions;

export default localidadSlice.reducer;