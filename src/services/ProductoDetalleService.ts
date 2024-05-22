
import IProductoDetalle from "../types/IProductoDetalle";
import ProductoDetallePost from "../types/post/ProductoDetallePost";
import  BackendClient  from "./BackendClient";


export default class ProductoDetalleService extends BackendClient<IProductoDetalle | ProductoDetallePost> {}