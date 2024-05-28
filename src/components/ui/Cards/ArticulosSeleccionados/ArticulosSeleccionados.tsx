import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box, Typography } from '@mui/material';
import InsumoService from '../../../../services/InsumoService';
import ProductoService from '../../../../services/ProductoService';

interface ArticuloSeleccionadoProps {
    onAgregarArticulo: (idArticulo: number, cantidad: number) => void;
}

const ArticuloSeleccionado: React.FC<ArticuloSeleccionadoProps> = ({ onAgregarArticulo }) => {
    const [idArticulo, setIdArticulo] = useState<number | null>(null);
    const [cantidad, setCantidad] = useState<number>(0);
    const [articulos, setArticulos] = useState<any[]>([]);

    const insumoService = new InsumoService();
    const url = import.meta.env.VITE_API_URL;
    const articuloService = new ProductoService();

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const articulosManufacturados = await articuloService.getAll(`${url}/ArticuloManufacturado`);
                const articulosInsumo = await insumoService.getAll(`${url}/ArticuloInsumo`);
                const articulos = articulosInsumo.filter((insumo) => !insumo.esParaElaborar);
                const articulosData = [...articulosManufacturados, ...articulos];
                setArticulos(articulosData);
            } catch (error) {
                console.error('Error al obtener los artículos:', error);
            }
        };

        fetchArticulos();
    }, [url, articuloService, insumoService]);

    const handleAgregarArticulo = () => {
        if (idArticulo !== null && cantidad > 0) {
            onAgregarArticulo(idArticulo, cantidad);
            setIdArticulo(null);
            setCantidad(0);
        }
    };

    return (
        <>
            <Typography variant="h6">Agregar Artículos</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel id="select-articulo-label">Seleccionar artículo</InputLabel>
                    <Select
                        labelId="select-articulo-label"
                        value={idArticulo !== null ? idArticulo : ''}
                        label="Seleccionar artículo"
                        onChange={(e) => setIdArticulo(e.target.value as number)}
                    >
                        <MenuItem value="" disabled>
                            <em>Seleccionar artículo</em>
                        </MenuItem>
                        {articulos.map((articulo) => (
                            <MenuItem key={articulo.id} value={articulo.id}>
                                {articulo.denominacion}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Cantidad"
                    type="number"
                    value={cantidad}
                    onChange={(e) => setCantidad(parseInt(e.target.value))}
                    sx={{ width: 100 }}
                />
                <Button
                    variant='contained'
                    onClick={handleAgregarArticulo}
                    sx={{
                        bgcolor: '#fb6376',
                        borderColor: '#fb6376',
                        "&:hover": {
                            bgcolor: "#d73754",
                        }
                    }}
                >
                    Agregar Artículo
                </Button>
            </Box>
        </>
    );
};

export default ArticuloSeleccionado;
