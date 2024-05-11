import DataModel from "./DataModel";
import IDomicilio from "./IDomicilio";
import IEmpresa from "./IEmpresa";

export default interface ISucursal extends DataModel<ISucursal>{
    nombre: string;
    horarioApertura: string;
    horarioCierre: string;
    domicilio: IDomicilio;
    empresa: IEmpresa;
    casaMatriz: boolean; // Nuevo campo para indicar si es la casa matriz
}