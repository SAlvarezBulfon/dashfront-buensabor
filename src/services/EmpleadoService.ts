import IEmpleado from "../types/Empleado";
import EmpleadoPost from "../types/post/EmpleadoPost";
import  BackendClient  from "./BackendClient";

export default class EmpleadoService extends BackendClient<IEmpleado | EmpleadoPost> {}