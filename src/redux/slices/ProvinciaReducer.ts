import Provincia from '../../types/IProvincia';
import { createGenericSlice } from './GenericReducer';

const provinciaSlice = createGenericSlice<Provincia[]>('provinciaState', { data: [] });

export const { setData: setProvincia, resetData: resetProvincia } = provinciaSlice.actions;

export default provinciaSlice.reducer;