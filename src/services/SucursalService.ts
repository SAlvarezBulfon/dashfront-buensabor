import ISucursal from "../types/ISucursal";
import SucursalPost from "../types/post/SucursalPost";
import BackendClient from "./BackendClient";


export default class SucursalService extends BackendClient<ISucursal | SucursalPost> {

}
