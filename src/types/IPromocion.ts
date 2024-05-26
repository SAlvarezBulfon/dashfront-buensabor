export default interface IPromocion {
    id: number;
    denominacion: string;
    fechaDesde: string;
    fechaHasta: string;
    horaDesde: string;
    horaHasta: string;
    descripcionDescuento: string;
    precioPromocional: number;
    tipoPromocion: string;
    idSucursales: number[];
    detalles: {
        cantidad: number;
        idArticulo: number;
    }[];
}
