import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { MenuItem, Select, FormControl, Checkbox, FormControlLabel } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import InsumoService from '../../../services/InsumoService';
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import Swal from 'sweetalert2';
import { InsumoPost } from '../../../types/post/InsumoPost';
import CategoriaService from '../../../services/CategoriaService';

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
    const categoriaService = new CategoriaService();

    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<{ id: number; denominacion: string }[]>([]);
    const [unidadMedida, setUnidadMedida] = useState<number>(initialValues.idUnidadMedida || 0);
    const [categoria, setCategoria] = useState<number>(initialValues.idCategoria || 0);
    const [esParaElaborar, setEsParaElaborar] = useState<boolean>(initialValues.esParaElaborar || false);
    const [categoriaOptions, setCategoriaOptions] = useState<{ id: number; denominacion: string }[]>([]);

    const fetchUnidadesMedida = async () => {
        try {
            const unidadesMedida = await unidadMedidaService.getAll(`${URL}/UnidadMedida`);
            setUnidadMedidaOptions(unidadesMedida);
        } catch (error) {
            console.error('Error al obtener las unidades de medida:', error);
        }
    };


    const fetchCategorias = async () => {
        try {
            const categorias = await categoriaService.getAll(`${URL}/categoria`);
            setCategoriaOptions(categorias);
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        precioVenta: Yup.number().required('Campo requerido'),
        precioCompra: Yup.number().required('Campo requerido').positive('El precio de compra debe ser un número positivo'),
        stockActual: Yup.number()
            .required('Campo requerido')
            .positive('El stock actual debe ser un número positivo')
            .min(Yup.ref('stockMinimo'), 'El stock no puede ser menor que el stock mínimo')
            .max(Yup.ref('stockMaximo'), 'El stock no puede ser mayor que el stock máximo'),
        stockMaximo: Yup.number().required('Campo requerido').positive('El stock máximo debe ser un número positivo'),
        stockMinimo: Yup.number().required('Campo requerido').positive('El stock mínimo debe ser un número positivo'),
    });

    const handleSubmit = async (values: InsumoPost) => {
        console.log(values)
        try {
            const insumoPost = {
                denominacion: values.denominacion,
                precioVenta: values.precioVenta,
                precioCompra: values.precioCompra,
                stockActual: values.stockActual,
                stockMaximo: values.stockMaximo,
                stockMinimo: values.stockMinimo,
                imagenes: [],
                idUnidadMedida: unidadMedida,
                esParaElaborar: esParaElaborar,
                idCategoria: categoria,
            };

            console.log(insumoPost);

            let response;


            if (isEditMode && insumoAEditar) {
                response = await insumoService.put(`${URL}/ArticuloInsumo`, insumoAEditar.id, insumoPost);
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
        fetchCategorias();
        fetchUnidadesMedida();
        if (isEditMode && insumoAEditar) {
            setUnidadMedida(insumoAEditar.idUnidadMedida);
            setCategoria(insumoAEditar.idCategoria);
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
                <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Denominación" disabled={isEditMode} />
                <TextFieldValue label="Precio de Venta" name="precioVenta" type="number" placeholder="Precio de Venta" />
                <TextFieldValue label="Precio de Compra" name="precioCompra" type="number" placeholder="Precio de Compra" />
                <TextFieldValue label="Stock Actual" name="stockActual" type="number" placeholder="Stock Actual" />
                <TextFieldValue label="Stock Máximo" name="stockMaximo" type="number" placeholder="Stock Máximo" />
                <TextFieldValue label="Stock Mínimo" name="stockMinimo" type="number" placeholder="Stock Mínimo" />

                <FormControl fullWidth>
                    <label className='label' style={{ marginTop: '16px' }}>Unidad de Medida</label>
                    <Select
                        labelId="unidadMedidaLabel"
                        id="unidadMedida"
                        value={unidadMedida}
                        onChange={(e) => setUnidadMedida(e.target.value as number)}
                        displayEmpty
                        disabled={isEditMode}
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
                
                <FormControl fullWidth>
                    <label className='label' style={{ marginTop: '16px' }}>Categoría</label>
                    <Select
                        labelId="categoriaLabel"
                        id="categoria"
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value as number)}
                        displayEmpty
                        disabled={isEditMode}
                    >
                        <MenuItem disabled value="">
                            Seleccione una categoría
                        </MenuItem>
                        {categoriaOptions.map((categoria) => (
                            <MenuItem key={categoria.id} value={categoria.id}>
                                {categoria.denominacion}
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
                            disabled={isEditMode}
                        />
                    }
                    label="Es para elaborar"
                />
            </div>
        </GenericModal>
    );
};

export default ModalInsumo;
