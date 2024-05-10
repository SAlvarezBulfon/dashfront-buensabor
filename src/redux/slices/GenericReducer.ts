import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definimos un tipo genérico para el estado inicial
interface IInitialState<T> {
  data: T;
}

// Definimos una función de utilidad para crear un slice genérico
export function createGenericSlice<T>(sliceName: string, initialState: IInitialState<T>) {
  return createSlice({
    name: sliceName,
    initialState,
    reducers: {
      setData: (state: IInitialState<any>, action: PayloadAction<any>) => {
        state.data = action.payload;
      },
      resetData: (state: IInitialState<any>) => {
        state.data = initialState.data;
      }
    },
  });
}

// Definimos un tipo genérico para las acciones
export type GenericSliceActions<T> = {
  setData: PayloadAction<T>;
  resetData: PayloadAction<void>;
};
