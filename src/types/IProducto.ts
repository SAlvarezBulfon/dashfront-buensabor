import IArticulo from "./IArticulo";
import IProductoDetalle from "./IProductoDetalle";
import { IUnidadMedida } from "./IUnidadMedida";


export default interface IProducto extends IArticulo{
    descripcion: string;
    preparacion: string;
    tiempoEstimadoMinutos: number;
    unidadMedida: IUnidadMedida;
    productoDetalle: IProductoDetalle[];
}