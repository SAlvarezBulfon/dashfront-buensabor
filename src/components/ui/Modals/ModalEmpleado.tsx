import React, { useState } from 'react';
import * as Yup from 'yup';
import { MenuItem, Select, FormControl, Grid } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import EmpleadoService from '../../../services/EmpleadoService';
import Swal from 'sweetalert2';
import EmpleadoPost from '../../../types/post/EmpleadoPost';
import IEmpleado from '../../../types/Empleado';
import useAuthToken from '../../../hooks/useAuthToken';

const roleNames: string[] = ['CAJERO', 'COCINERO', 'EMPLEADO'];

interface ModalEmpleadoProps {
    modalName: string;
    initialValues: any;
    isEditMode: boolean;
    getEmpleados: Function;
    empleadoAEditar?: any;
    idSucursal: number;
}

const ModalEmpleado: React.FC<ModalEmpleadoProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getEmpleados,
    empleadoAEditar,
    idSucursal,
}) => {
    const empleadoService = new EmpleadoService();
    const URL = import.meta.env.VITE_API_URL;
    const getToken = useAuthToken();

    const [rol, setRol] = useState<string>(initialValues.rol || 'EMPLEADO');

    const validationSchema = Yup.object().shape({
        nombre: Yup.string().required('Campo requerido'),
        apellido: Yup.string().required('Campo requerido'),
        telefono: Yup.string()
            .matches(/^\d{10}$/, 'El teléfono debe tener 10 dígitos')
            .required('Campo requerido'),
        email: Yup.string().email('Email inválido').required('Campo requerido'),
        fechaNacimiento: Yup.date()
            .max(new Date(), 'La fecha de nacimiento no puede ser mayor al día de hoy')
            .required('Campo requerido'),
    });

    const checkEmailExistence = async (email: string): Promise<boolean> => {
        try {
            const response = await fetch(`${URL}/empleado/findByEmail?email=${encodeURIComponent(email)}`);
            const data = await response.json();
            return !!data;
        } catch (error) {
            console.error('Error al comprobar la existencia del email:', error);
            return false;
        }
    };

    const handleSubmit = async (values: EmpleadoPost) => {
        let id: number | null = null;

        try {
            const emailExists = await checkEmailExistence(values.email);

            if (emailExists && !isEditMode) {
                Swal.fire({
                    title: 'Error',
                    text: 'El email ya está en uso',
                    icon: 'error',
                    customClass: {
                        container: 'my-swal',
                    },
                });
                return;
            }

            const empleadoPost = {
                nombre: values.nombre,
                apellido: values.apellido,
                telefono: values.telefono,
                email: values.email,
                fechaNacimiento: values.fechaNacimiento,
                rol: rol,
                idSucursal: idSucursal,
            };

            let response;
            const token = await getToken();
            if (isEditMode && empleadoAEditar) {
                await empleadoService.putSec(`${URL}/empleado`, empleadoAEditar.id, empleadoPost, token);
                id = empleadoAEditar.id;
            } else {
                response = await empleadoService.postSec(`${URL}/empleado`, empleadoPost, token) as IEmpleado;
                id = response.id;
            }

            if (id !== null) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: isEditMode ? 'Empleado editado correctamente' : 'Empleado creado correctamente',
                    icon: 'success',
                    customClass: {
                        container: 'my-swal',
                    },
                });
                getEmpleados();
            } else {
                throw new Error('El ID del empleado es nulo');
            }
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al enviar los datos',
                icon: 'error',
                customClass: {
                    container: 'my-swal',
                },
            });
        }
    };

    return (
        <GenericModal
            modalName={modalName}
            title={isEditMode ? 'Editar Empleado' : 'Añadir Empleado'}
            initialValues={empleadoAEditar || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre" disabled={isEditMode} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextFieldValue label="Apellido" name="apellido" type="text" placeholder="Apellido" disabled={isEditMode} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextFieldValue label="Teléfono" name="telefono" type="text" placeholder="Teléfono" disabled={isEditMode} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextFieldValue label="Email" name="email" type="email" placeholder="Email" disabled={isEditMode} />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextFieldValue label="Fecha de Nacimiento" name="fechaNacimiento" type="date" placeholder="Fecha de Nacimiento" disabled={isEditMode} />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <label className='label'>Tipo de Empleado</label>
                            <Select
                                labelId="rolLabel"
                                id="rol"
                                value={rol}
                                onChange={(e) => setRol(e.target.value as string)}
                                displayEmpty
                            >
                                <MenuItem disabled value="">
                                    Seleccione un tipo de empleado
                                </MenuItem>
                                {roleNames.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </div>
        </GenericModal>
    );
};

export default ModalEmpleado;


