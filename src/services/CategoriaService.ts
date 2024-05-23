
import { ICategoria } from "../types/Categoria";
import { CategoriaPost } from "../types/post/CategoriaPost";
import  BackendClient  from "./BackendClient";

export default class CategoriaService extends BackendClient<ICategoria | CategoriaPost> {}