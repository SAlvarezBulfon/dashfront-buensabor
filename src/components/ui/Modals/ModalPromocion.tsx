import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel, Grid, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import PromocionService from '../../../services/PromocionService';
import EmpresaService from '../../../services/EmpresaService';
import SucursalService from '../../../services/SucursalService';
import ISucursal from '../../../types/ISucursal';
import PromocionPost from '../../../types/post/PromocionPost';
import IPromocion from '../../../types/IPromocion';
import GenericModal from './GenericModal';
import Swal from 'sweetalert2';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import DeleteIcon from '@mui/icons-material/Delete';
import ArticuloSeleccionado from '../Cards/ArticulosSeleccionados/ArticulosSeleccionados';
import { TipoPromocion } from '../../../types/enums/TipoPromocion';

interface ModalPromocionProps {
    modalName: string;
    initialValues: PromocionPost | any;
    isEditMode: boolean;
    fetchPromociones: () => void;
    promocionAEditar?: any;
    idSucursal: number;
}

const ModalPromocion: React.FC<ModalPromocionProps> = ({
    modalName,
    initialValues,
    isEditMode,
    fetchPromociones,
    promocionAEditar,
    idSucursal
}) => {
    const URL = import.meta.env.VITE_API_URL;

    const promocionService = new PromocionService();
    const empresaService = new EmpresaService();
    const sucursalService = new SucursalService();

    const [sucursales, setSucursales] = useState<ISucursal[]>([]);
    const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);
    const [selectedArticles, setSelectedArticles] = useState<{ idArticulo: number, cantidad: number, denominacion: string }[]>([]);
    const [tipoPromocion, setTipoPromocion] = useState(TipoPromocion.PROMOCION);


    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        fechaDesde: Yup.date().required('Campo requerido'),
        fechaHasta: Yup.date().required('Campo requerido'),
        horaDesde: Yup.string().required('Campo requerido'),
        horaHasta: Yup.string().required('Campo requerido'),
        descripcionDescuento: Yup.string().required('Campo requerido'),
        precioPromocional: Yup.number().required('Campo requerido'),
    });

    const fetchSucursales = async () => {
        try {
            const sucursal = await sucursalService.get(`${URL}/sucursal`, idSucursal) as ISucursal;
            const empresaid = sucursal.empresa.id;
            const empresa = await empresaService.get(`${URL}/empresa/sucursales`, empresaid);
            const sucursales = empresa.sucursales;
            setSucursales(sucursales);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
        }
    };

    useEffect(() => {
        fetchSucursales();
    }, [idSucursal]);

    const handleAgregarArticulo = (idArticulo: number, cantidad: number, denominacion: string) => {
        const nuevoArticulo = { idArticulo, cantidad, denominacion };
        setSelectedArticles([...selectedArticles, nuevoArticulo]);
    };

    const handleEliminarArticulo = (index: number) => {
        const nuevosArticulos = [...selectedArticles];
        nuevosArticulos.splice(index, 1);
        setSelectedArticles(nuevosArticulos);
    };


    const handleTipoPromocionChange = (event: SelectChangeEvent<TipoPromocion>) => {
        const tipo = event.target.value as TipoPromocion;
        // Actualiza el estado tipoPromocion
        setTipoPromocion(tipo);
    };



    useEffect(() => {
        const articulosGuardados = JSON.parse(localStorage.getItem('articulosSeleccionados') || '[]');
        setSelectedArticles(articulosGuardados);
    }, []);

    useEffect(() => {
        localStorage.setItem('articulosSeleccionados', JSON.stringify(selectedArticles));
    }, [selectedArticles]);

    useEffect(() => {
        if (!isEditMode) {
            return () => setSelectedArticles([]);
        }
    }, [isEditMode]);



    const handleSubmit = async (values: PromocionPost) => {
        try {
            if (selectedSucursales.length > 0) {
                const promocionPost: PromocionPost = {
                    denominacion: values.denominacion,
                    fechaDesde: values.fechaDesde,
                    fechaHasta: values.fechaHasta,
                    horaDesde: values.horaDesde,
                    horaHasta: values.horaHasta,
                    descripcionDescuento: values.descripcionDescuento,
                    precioPromocional: values.precioPromocional,
                    tipoPromocion: values.tipoPromocion,
                    idSucursales: selectedSucursales,
                    detalles: selectedArticles
                };
                console.log(promocionPost)
                let response;


                if (isEditMode && promocionAEditar) {
                    response = await promocionService.put(`${URL}/promocion`, promocionAEditar.id, promocionPost);

                } else {
                    response = await promocionService.post(`${URL}/promocion`, promocionPost) as IPromocion;

                }


                if (response) {

                    Swal.fire({
                        title: '¡Éxito!',
                        text: isEditMode ? 'Promocion editada correctamente' : 'Promocion creada correctamente',
                        icon: 'success',
                    });
                    fetchPromociones();
                } else {
                    throw new Error('No se recibió una respuesta del servidor.');
                }
            } else {
                throw new Error('Debe seleccionar al menos una sucursal.');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            Swal.fire({
                title: 'Error',
                icon: 'error',
            });
        }
    };

    const handleToggleSucursal = (sucursalId: number) => {
        if (selectedSucursales.includes(sucursalId)) {
            setSelectedSucursales(selectedSucursales.filter(id => id !== sucursalId));
        } else {
            setSelectedSucursales([...selectedSucursales, sucursalId]);
        }
    };

    return (
        <GenericModal
            modalName={modalName}
            title={isEditMode ? 'Editar Promocion' : 'Añadir Promocion'}
            initialValues={promocionAEditar || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Denominación" disabled={isEditMode} />
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextFieldValue name="fechaDesde" type="date" placeholder="Fecha Desde" label='Fecha de inicio' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextFieldValue name="fechaHasta" type="date" placeholder="Fecha Hasta" label='Fecha de Fin' />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextFieldValue name="horaDesde" type="time" placeholder="Hora Desde" label='Hora de inicio' />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextFieldValue name="horaHasta" type="time" placeholder="Hora Hasta" label='Hora de Fin' />
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextFieldValue label="Descripción del Descuento" name="descripcionDescuento" type="text" placeholder="Descripcion Descuento" disabled={isEditMode} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextFieldValue label="Precio Promocional" name="precioPromocional" type="number" placeholder="Precio Promocional" />

                    </Grid>
                </Grid>
                <FormControl fullWidth>
                    <InputLabel id="select-tipo-promocion-label">Tipo de Promoción</InputLabel>
                    <Select
                        labelId="select-tipo-promocion-label"
                        id="select-tipo-promocion"
                        value={tipoPromocion}
                        onChange={handleTipoPromocionChange}
                        label="Tipo de Promoción"
                        name="tipoPromocion"
                        disabled={isEditMode}
                    >
                        {Object.values(TipoPromocion).map((tipo) => (
                            <MenuItem key={tipo} value={tipo}>
                                {tipo}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {!isEditMode && (
                    <>
                        <p>Selecciona las sucursales:</p>
                        {sucursales.map((sucursal: ISucursal) => (
                            <FormControlLabel
                                key={sucursal.id}
                                control={
                                    <Checkbox
                                        checked={selectedSucursales.includes(sucursal.id)}
                                        onChange={() => handleToggleSucursal(sucursal.id)}
                                    />
                                }
                                label={sucursal.nombre}
                            />
                        ))}
                    </>
                )}

                <ArticuloSeleccionado onAgregarArticulo={handleAgregarArticulo} />
                {!isEditMode && (
                    <div>
                        <Typography variant='body1' sx={{ mt: 2 }}>Artículos seleccionados:</Typography>
                        <List>
                            {selectedArticles.map((article, index) => (
                                <ListItem key={article.idArticulo}>
                                    <ListItemText primary={`${article.denominacion} - ${article.cantidad}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" onClick={() => handleEliminarArticulo(index)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                )}
            </div>
        </GenericModal>
    );
}

export default ModalPromocion;