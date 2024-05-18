
import { IInsumo } from "../types/IInsumo";
import { InsumoPost } from "../types/post/InsumoPost";
import  BackendClient  from "./BackendClient";

export default class InsumoService extends BackendClient<IInsumo | InsumoPost> {}