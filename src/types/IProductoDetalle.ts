import DataModel from "./DataModel";
import { IInsumo } from "./IInsumo";


export default interface IProductoDetalle extends DataModel<IProductoDetalle>{
    cantidad: number;
    insumo: IInsumo;
}