import DataModel from "./DataModel";
import ICategoria from "./ICategoria";
import { IUnidadMedida } from "./IUnidadMedida";



export default interface IArticulo extends DataModel<IArticulo>{
    denominacion: string;
    precioVenta: number;
    unidadMedida: IUnidadMedida;
    categoria: ICategoria;
}