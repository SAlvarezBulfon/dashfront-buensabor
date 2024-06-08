import React, { useState } from 'react';
import * as Yup from 'yup';
import { MenuItem, Select, FormControl, Grid } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import EmpleadoService from '../../../services/EmpleadoService';
import Swal from 'sweetalert2';
import EmpleadoPost from '../../../types/post/EmpleadoPost';
import IEmpleado from '../../../types/Empleado';
import { Rol } from '../../../types/enums/Rol';

// Definir un objeto para mapear los nombres de los roles
const roleNames: { [key: string]: string } = {
    [Rol.CAJERO]: 'CAJERO',
    [Rol.COCINERO]: 'COCINERO',
    [Rol.EMPLEADO]: 'EMPLEADO',
};

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

    const [tipoEmpleado, setTipoEmpleado] = useState<Rol>(initialValues.tipoEmpleado || Rol.EMPLEADO);

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
            return !!data; // Devuelve true si se encuentra un empleado con ese email, false si no se encuentra nada
        } catch (error) {
            console.error('Error al comprobar la existencia del email:', error);
            return false; // Devuelve false en caso de error
        }
    };

    const handleSubmit = async (values: EmpleadoPost) => {
        let id: number | null = null;

        try {
            // Verificar si el email ya existe en la base de datos
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
                tipoEmpleado: tipoEmpleado,
                idSucursal: idSucursal,
            };

            let response;

            if (isEditMode && empleadoAEditar) {
                await empleadoService.put(`${URL}/empleado`, empleadoAEditar.id, empleadoPost);
                id = empleadoAEditar.id;
            } else {
                response = await empleadoService.post(`${URL}/empleado`, empleadoPost) as IEmpleado;
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
                getEmpleados(); // Actualiza los empleados después de guardar
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
                                labelId="tipoEmpleadoLabel"
                                id="tipoEmpleado"
                                value={tipoEmpleado}
                                onChange={(e) => setTipoEmpleado(e.target.value as Rol)}
                                displayEmpty
                            >
                                <MenuItem disabled value="">
                                    Seleccione un tipo de empleado
                                </MenuItem>
                                {Object.keys(roleNames).map((key) => (
                                    <MenuItem key={key} value={key}>
                                        {roleNames[key]}
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
