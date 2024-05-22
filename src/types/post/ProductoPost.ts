import ProductoDetallePost from "./ProductoDetallePost";


export default interface ProductoPost {
    denominacion: string;
    descripcion: string;
    tiempoEstimadoMinutos: number;
    precioVenta: number
    preparacion: string;
    idUnidadMedida: number;
    articuloManufacturadoDetalles: ProductoDetallePost[];
    detalles?: ProductoDetallePost[]
  }
  