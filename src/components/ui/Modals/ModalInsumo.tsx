import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { MenuItem, Select, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import InsumoService from '../../../services/InsumoService';
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import Swal from 'sweetalert2';
import { IInsumo } from '../../../types/IInsumo';

interface ModalInsumoProps {
    modalName: string;
    initialValues: any;
    isEditMode: boolean;
    getInsumos: Function;
    insumoAEditar?: any;
}

const ModalInsumo: React.FC<ModalInsumoProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getInsumos,
    insumoAEditar,
}) => {
    const insumoService = new InsumoService();
    const unidadMedidaService = new UnidadMedidaService();
    const URL = import.meta.env.VITE_API_URL;

    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<{ id: number; denominacion: string }[]>([]);
    const [unidadMedida, setUnidadMedida] = useState<number>(initialValues.idUnidadMedida || 0);
    const [esParaElaborar, setEsParaElaborar] = useState<boolean>(initialValues.esParaElaborar || false);

    const fetchUnidadesMedida = async () => {
        try {
            const unidadesMedida = await unidadMedidaService.getAll(`${URL}/UnidadMedida`);
            setUnidadMedidaOptions(unidadesMedida);
        } catch (error) {
            console.error('Error al obtener las unidades de medida:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        precioVenta: Yup.number().required('Campo requerido').positive('El precio de venta debe ser un número positivo'),
        precioCompra: Yup.number().required('Campo requerido').positive('El precio de compra debe ser un número positivo'),
        stockActual: Yup.number()
            .required('Campo requerido')
            .positive('El stock actual debe ser un número positivo')
            .min(Yup.ref('stockMinimo'), 'El stock no puede ser menor que el stock mínimo')
            .max(Yup.ref('stockMaximo'), 'El stock no puede ser mayor que el stock máximo'),
        stockMaximo: Yup.number().required('Campo requerido').positive('El stock máximo debe ser un número positivo'),
        stockMinimo: Yup.number().required('Campo requerido').positive('El stock mínimo debe ser un número positivo'),
    });


    const handleSubmit = async (values: IInsumo) => {
        console.log(values)
        try {
            const insumoPost = {
                ...values,
                idUnidadMedida: unidadMedida,
                esParaElaborar: esParaElaborar,
            };

            let response;

            if (isEditMode && insumoAEditar) {
                const updatedInsumo = {
                    ...values,
                    idUnidadMedida: unidadMedida,
                    esParaElaborar: esParaElaborar,
                }
                response = await insumoService.put(`${URL}/ArticuloInsumo`, insumoAEditar.id, updatedInsumo);
                getInsumos();
            } else {
                response = await insumoService.post(`${URL}/ArticuloInsumo`, insumoPost);
                getInsumos();
            }

            if (response) {
                Swal.fire({
                    title: '¡Éxito!',
                    text: isEditMode ? 'Insumo editado correctamente' : 'Insumo creado correctamente',
                    icon: 'success',
                });
                getInsumos();
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
        fetchUnidadesMedida();
        if (isEditMode && insumoAEditar) {
            setUnidadMedida(insumoAEditar.idUnidadMedida);
            setEsParaElaborar(insumoAEditar.esParaElaborar);
        }
    }, [isEditMode, insumoAEditar]);

    return (
        <GenericModal
            modalName={modalName}
            title={isEditMode ? 'Editar Insumo' : 'Añadir Insumo'}
            initialValues={insumoAEditar || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Denominación" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <TextFieldValue label="Precio de Venta" name="precioVenta" type="number" placeholder="Precio de Venta" />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <TextFieldValue label="Precio de Compra" name="precioCompra" type="number" placeholder="Precio de Compra" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <TextFieldValue label="Stock Actual" name="stockActual" type="number" placeholder="Stock Actual" />
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                        <TextFieldValue label="Stock Máximo" name="stockMaximo" type="number" placeholder="Stock Máximo" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <TextFieldValue label="Stock Mínimo" name="stockMinimo" type="number" placeholder="Stock Mínimo" />
                    </div>
                </div>

                <FormControl fullWidth>
                    <label className='label' style={{ marginTop: '16px' }}>Unidad de Medida</label>
                    <Select
                        labelId="unidadMedidaLabel"
                        id="unidadMedida"
                        value={unidadMedida}
                        onChange={(e) => setUnidadMedida(e.target.value as number)}
                        displayEmpty
                    >
                        <MenuItem disabled value="">
                            Seleccione una unidad de medida
                        </MenuItem>
                        {unidadMedidaOptions.map((unidad) => (
                            <MenuItem key={unidad.id} value={unidad.id}>
                                {unidad.denominacion}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={esParaElaborar}
                            onChange={(e) => setEsParaElaborar(e.target.checked)}
                            name="esParaElaborar"
                        />
                    }
                    label="Es para elaborar"
                />
            </div>
        </GenericModal>
    );
};

export default ModalInsumo;
