import Pais from '../../types/IPais';
import { createGenericSlice } from './GenericReducer';

const paisSlice = createGenericSlice<Pais[]>('paisState', { data: [] });

export const { setData: setPais, resetData: resetPais } = paisSlice .actions;

export default paisSlice .reducer;