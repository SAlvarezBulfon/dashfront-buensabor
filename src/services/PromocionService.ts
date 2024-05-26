// Importamos el tipo de dato IPromocion y la clase BackendClient
import IPromocion from "../types/IPromocion";
import PromocionPost from "../types/post/PromocionPost";
import BackendClient from "./BackendClient";

// Clase PromocionService que extiende BackendClient para interactuar con la API de promociones
export default class PromocionService extends BackendClient<IPromocion | PromocionPost> {}