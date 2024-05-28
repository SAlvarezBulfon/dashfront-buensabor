import DataModel from "./DataModel";
import { IInsumo } from "./IInsumo";
import IProducto from "./IProducto";



export default interface IPromocionDetalle extends DataModel<IPromocionDetalle>{
    cantidad: number;
    articulo: IInsumo | IProducto;
}