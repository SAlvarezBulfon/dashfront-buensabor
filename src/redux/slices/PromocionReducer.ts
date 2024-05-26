// redux/slices/PromocionReducer.ts
import { createSlice } from '@reduxjs/toolkit';

export const promocionSlice = createSlice({
    name: 'promocion',
    initialState: {
        data: []
    },
    reducers: {
        setPromociones: (state, action) => {
            state.data = action.payload;
        },
    },
});

export const { setPromociones } = promocionSlice.actions;

export default promocionSlice.reducer;
