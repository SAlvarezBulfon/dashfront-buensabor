import IPromocionDetalle from "../types/IPromocionDetalle";
import PromocionDetallePost from "../types/post/PromocionDetallePost";
import  BackendClient  from "./BackendClient";


export default class PromocionDetalleService extends BackendClient<IPromocionDetalle | PromocionDetallePost> {}