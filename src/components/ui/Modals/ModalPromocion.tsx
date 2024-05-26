import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { TextField, Checkbox, FormControlLabel, Grid } from '@mui/material';
import PromocionService from '../../../services/PromocionService';
import EmpresaService from '../../../services/EmpresaService';
import SucursalService from '../../../services/SucursalService';
import ISucursal from '../../../types/ISucursal';
import PromocionPost from '../../../types/post/PromocionPost';
import IPromocion from '../../../types/IPromocion';
import GenericModal from './GenericModal';
import Swal from 'sweetalert2';

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
    const url = import.meta.env.VITE_API_URL;

    const promocionService = new PromocionService();
    const empresaService = new EmpresaService();
    const sucursalService = new SucursalService();

    const [sucursales, setSucursales] = useState<ISucursal[]>([]);
    const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);
   

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        fechaDesde: Yup.date().required('Campo requerido'),
        fechaHasta: Yup.date().required('Campo requerido'),
        horaDesde: Yup.string().required('Campo requerido'),
        horaHasta: Yup.string().required('Campo requerido'),
        descripcionDescuento: Yup.string().required('Campo requerido'),
        precioPromocional: Yup.number().required('Campo requerido'),
        tipoPromocion: Yup.string().required('Campo requerido'),
    });

    const fetchSucursales = async () => {
        try {
            const sucursal = await sucursalService.get(`${url}/sucursal`, idSucursal) as ISucursal;
            const empresaid = sucursal.empresa.id;
            const empresa = await empresaService.get(`${url}/empresa/sucursales`, empresaid);
            const sucursales = empresa.sucursales;
            setSucursales(sucursales);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
        }
    };

    useEffect(() => {
        fetchSucursales();
    }, [idSucursal]);
    
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
                    detalles: [] // Inicialmente vacío
                };
                
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
            <TextField label="Denominación" name="denominacion" type="text" placeholder="Denominación" />
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField name="fechaDesde" type="date" placeholder="Fecha Desde" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField name="fechaHasta" type="date" placeholder="Fecha Hasta" fullWidth />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField name="horaDesde" type="time" placeholder="Hora Desde" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField name="horaHasta" type="time" placeholder="Hora Hasta" fullWidth />
                </Grid>
            </Grid>
            <TextField label="Descripción del Descuento" name="descripcionDescuento" type="text" placeholder="Descripcion Descuento" />
            <TextField label="Precio Promocional" name="precioPromocional" type="number" placeholder="Precio Promocional" />
            <TextField label="Tipo de Promoción" name="tipoPromocion" type="text" placeholder="Tipo Promocional" />

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
        </div>
    </GenericModal>
    );
};

export default ModalPromocion;
