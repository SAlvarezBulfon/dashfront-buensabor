import IDomicilio from "../types/IDomicilio";
import DomicilioPost from "../types/post/DomicilioPost";
import  BackendClient  from "./BackendClient";

export default class DomicilioService extends BackendClient<IDomicilio | DomicilioPost> {}