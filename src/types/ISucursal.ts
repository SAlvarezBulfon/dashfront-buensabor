import { ICategoria } from "./Categoria";
import DataModel from "./DataModel";
import IDomicilio from "./IDomicilio";
import IEmpresa from "./IEmpresa";

export default interface ISucursal extends DataModel<ISucursal>{
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    domicilio: IDomicilio;
    empresa: IEmpresa;
    esCasaMatriz: boolean; 
    categorias?: ICategoria[];
}