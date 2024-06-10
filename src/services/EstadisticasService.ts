import { IRankingProductos } from '../types/IRankingProductos ';
import { IIngresosMensuales } from '../types/RecaudacionesMensuales';

export async function getRanking(fechaDesde: string, fechaHasta: string): Promise<IRankingProductos[]> {
    const url = `${import.meta.env.VITE_API_URL}/estadisticas/ranking?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            console.error("Error en la solicitud:", response.statusText);
            throw new Error(response.statusText);
        }

        return response.json();
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return Promise.reject(error);
    }
}

export async function getIngresosMensuales(fechaDesde: string, fechaHasta: string): Promise<IIngresosMensuales[]> {
    const url = `${import.meta.env.VITE_API_URL}/estadisticas/recaudacionesMensuales?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            console.error("Error en la solicitud:", response.statusText);
            throw new Error(response.statusText);
        }

        return response.json();
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return Promise.reject(error);
    }
}

