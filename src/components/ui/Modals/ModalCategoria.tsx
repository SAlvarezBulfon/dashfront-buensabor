import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import CategoriaService from '../../../services/CategoriaService';
import Swal from 'sweetalert2';
import { CategoriaPost } from '../../../types/post/CategoriaPost';
import SucursalService from '../../../services/SucursalService';
import EmpresaService from '../../../services/EmpresaService';
import ISucursal from '../../../types/ISucursal';

interface ModalCategoriaProps {
    modalName: string;
    initialValues: CategoriaPost | any;
    isEditMode: boolean;
    getCategoria: () => void;
    categoriaAEditar?: any;
    idSucursal: number;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getCategoria,
    categoriaAEditar,
    idSucursal
}) => {
    const categoriaService = new CategoriaService();
    const URL = import.meta.env.VITE_API_URL;
    const [sucursales, setSucursales] = useState<ISucursal[]>([]);
    const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);
    const empresaService = new EmpresaService();
    const sucursalService = new SucursalService();
    const url = import.meta.env.VITE_API_URL;

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        esInsumo: Yup.boolean().required('Campo requerido'),
    });

    const fetchSucursales = async () => {
        try {
            const sucursal = await sucursalService.get(`${url}/sucursal`, idSucursal) as ISucursal;
            const empresaid = sucursal.empresa.id;
            const empresa = await empresaService.get(`${url}/empresa/sucursales`, empresaid);
            const sucursales = empresa.sucursales;
            console.log(empresa);
            setSucursales(sucursales);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
        }
    };

    useEffect(() => {
        fetchSucursales();
    }, [idSucursal]);

    const handleSubmit = async (values: CategoriaPost) => {
        try {
            if (selectedSucursales.length > 0) {
                const categoriaPost = {
                    denominacion: values.denominacion,
                    esInsumo: values.esInsumo,
                    idSucursales: selectedSucursales,
                };

                let response;

                if (isEditMode && categoriaAEditar) {
                    response = await categoriaService.put(`${URL}/categoria`, categoriaAEditar.id, categoriaPost);
                    getCategoria();
                } else {
                    response = await categoriaService.post(`${URL}/categoria`, categoriaPost);
                    getCategoria();
                }

                if (response) {
                    Swal.fire({
                        title: '¡Éxito!',
                        text: isEditMode ? 'Categoría editada correctamente' : 'Categoría creada correctamente',
                        icon: 'success',
                    });
                    getCategoria(); // Refresh the category list
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
            title={isEditMode ? 'Editar Categoría' : 'Añadir Categoría'}
            initialValues={categoriaAEditar || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Denominación" />
                <FormControlLabel
                    control={
                        <Checkbox
                            name="esInsumo"
                            defaultChecked={initialValues.esInsumo}
                        />
                    }
                    label="Es insumo"
                />
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

export default ModalCategoria;
