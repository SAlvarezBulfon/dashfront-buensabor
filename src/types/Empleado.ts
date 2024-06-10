import DataModel from "./DataModel";
import { Rol } from "./enums/Rol";
import ISucursal from "./ISucursal";

export default interface IEmpleado extends DataModel<IEmpleado>{
    nombre: string,
    apellido: string,
    telefono: string,
    email: string,
    fechaNacimiento: string,
    rol: Rol,
    sucursal: ISucursal
}