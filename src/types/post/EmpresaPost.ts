import ISucursal from "../ISucursal";


export default interface EmpresaPost {
    nombre: string;
    razonSocial: string;
    cuil: number;
    sucursales: ISucursal[];
}