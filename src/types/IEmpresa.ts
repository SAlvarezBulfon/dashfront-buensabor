import DataModel from "./DataModel";
import IImagen from "./IImagen";
import ISucursal from "./ISucursal";

export default interface IEmpresa extends DataModel<IEmpresa>{
    nombre: string;
    razonSocial: string;
    cuil: number;
    sucursales: ISucursal[];
    imagenes: IImagen[]
}