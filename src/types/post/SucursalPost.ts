import DomicilioPost from "./DomicilioPost";

export default interface SucursalPost{
    nombre: string;
    horarioApertura: string; 
    horarioCierre: string; 
    esCasaMatriz: boolean;
    domicilio: DomicilioPost;
    idEmpresa: number;
}