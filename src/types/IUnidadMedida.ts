import DataModel from "./DataModel";

export interface IUnidadMedida extends DataModel<IUnidadMedida> {
    id: number;
    denominacion: string;
  }
  