import IImagen from "../IImagen";


export interface InsumoPost  {
    denominacion: string,
    precioVenta: number,
    idUnidadMedida: number,
    precioCompra: number,
    stockActual: number,
    stockMaximo: number,
    stockMinimo: number,
    esParaElaborar: boolean,
    imagenes: IImagen[],
    idCategoria: number,
    idSucursales: number[],
  }