import { IInsumo } from '../../types/IInsumo';
import { createGenericSlice } from './GenericReducer';

const insumoSlice = createGenericSlice<IInsumo[]>('insumoState', { data: [] });

export const { setData: setInsumo, resetData: resetInsumo } = insumoSlice.actions;

export default insumoSlice.reducer;