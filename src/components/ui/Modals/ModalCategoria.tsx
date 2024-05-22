import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import CategoriaService from '../../../services/CategoriaService';
import Swal from 'sweetalert2';
import { CategoriaPost } from '../../../types/post/CategoriaPost';

interface ModalCategoriaProps {
    modalName: string;
    initialValues: CategoriaPost | any;
    isEditMode: boolean;
    getCategoria: () => void;
    categoriaAEditar?: any;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getCategoria,
    categoriaAEditar,
}) => {
    const categoriaService = new CategoriaService();
    const URL = import.meta.env.VITE_API_URL;

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        esInsumo: Yup.boolean().required('Campo requerido'),
    });

    const handleSubmit = async (values: CategoriaPost) => {
        try {
            const categoriaPost = {
                denominacion: values.denominacion,
                esInsumo: values.esInsumo,
                sucursales: values.sucursales || [],
            };

            let response;

            if (isEditMode && categoriaAEditar) {
                response = await categoriaService.put(`${URL}/categoria`, categoriaAEditar.id, categoriaPost);
            } else {
                response = await categoriaService.post(`${URL}/categoria`, categoriaPost);
            }

            if (response) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: isEditMode ? 'Categoría editada correctamente' : 'Categoría creada correctamente',
                    icon: 'success',
                });
                getCategoria();
            } else {
                throw new Error('No se recibió una respuesta del servidor.');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al enviar los datos',
                icon: 'error',
            });
        }
    };

    useEffect(() => {
        // Puedes agregar cualquier configuración inicial aquí si es necesario
    }, [isEditMode, categoriaAEditar]);

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
            </div>
        </GenericModal>
    );
};

export default ModalCategoria;
