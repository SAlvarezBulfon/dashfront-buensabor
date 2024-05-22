import DataModel from "./DataModel";
import ISucursal from "./ISucursal";


export interface ICategoria extends DataModel<ICategoria> {
    denominacion: string,
    esInsumo: boolean,
    sucursales: ISucursal[]
    subCategoriaS: ICategoria[];
  }