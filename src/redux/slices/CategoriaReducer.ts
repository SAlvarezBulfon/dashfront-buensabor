
import { ICategoria } from '../../types/Categoria';
import { createGenericSlice } from './GenericReducer';

const categoriaSlice = createGenericSlice<ICategoria[]>('categoriaState', { data: [] });

export const { setData: setCategoria, resetData: resetCategoria } = categoriaSlice.actions;

export default categoriaSlice.reducer;
