import DataModel from "./DataModel";
import IImagen from "./IImagen";
import { IUnidadMedida } from "./IUnidadMedida";

export interface IInsumo extends DataModel<IInsumo> {
    denominacion: string,
    precioVenta: number,
    unidadMedida: IUnidadMedida,
    precioCompra: number,
    stockActual: number,
    stockMaximo: number,
    stockMinimo: number,
    esParaElaborar: boolean,
    imagenes: IImagen[],
  }