import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material';
import InsumoService from '../../../../services/InsumoService';
import ProductoService from '../../../../services/ProductoService';

interface ArticuloSeleccionadoProps {
    onAgregarArticulo: (idArticulo: number, cantidad: number, denominacion: string) => void;
}


const ArticuloSeleccionado: React.FC<ArticuloSeleccionadoProps> = ({ onAgregarArticulo }) => {
    const [idArticulo, setIdArticulo] = useState('');
    const [cantidad, setCantidad] = useState(0);
    const [articulos, setArticulos] = useState<any[]>([]);
    
    const insumoService = new InsumoService();
    const url = import.meta.env.VITE_API_URL;
    const articuloService = new ProductoService();

    useEffect(() => {
        const fetchArticulos = async () => {
            try {
                const articulosManufacturados = await articuloService.getAll(url + '/ArticuloManufacturado');
                const articulosInsumo = await insumoService.getAll(url + '/ArticuloInsumo');
                const articulos = articulosInsumo.filter((insumo) => !insumo.esParaElaborar);
                const articulosData = [...articulosManufacturados, ...articulos];
                setArticulos(articulosData);
            } catch (error) {
                console.error('Error al obtener los artículos:', error);
            }
        };

        fetchArticulos();
    }, []);

    const handleAgregarArticulo = () => {
        if (idArticulo && cantidad) {
            const articuloSeleccionado = articulos.find(articulo => articulo.id === parseInt(idArticulo));
            if (articuloSeleccionado) {
                onAgregarArticulo(parseInt(idArticulo), cantidad, articuloSeleccionado.denominacion);
                setIdArticulo('');
                setCantidad(0);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="select-articulo-label">Seleccionar artículo</InputLabel>
                <Select
                    labelId="select-articulo-label"
                    value={idArticulo}
                    label="Seleccionar artículo"
                    onChange={(e) => setIdArticulo(e.target.value)}
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
                inputProps={{ min: 0 }}
                sx={{ width: 100 }}
            />
            <Button variant='contained' onClick={handleAgregarArticulo}>
                Agregar Artículo
            </Button>
        </Box>
    );
};

export default ArticuloSeleccionado;
