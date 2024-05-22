import DataModel from "./DataModel";

export default interface ICategoria extends DataModel<ICategoria>{
    denominacion:string;
    subCategoriaS: ICategoria[];
    esInsumo: boolean;
}