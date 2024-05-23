import DataModel from "./DataModel";

export default interface ICategoria extends DataModel<ICategoria>{
    denominacion:string;
    subCategorias: ICategoria[];
    esInsumo: boolean;
}