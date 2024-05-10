import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { Form, Button } from 'react-bootstrap';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import IArticuloManufacturado from '../../../types/ArticuloManufacturado';
import ProductoService from '../../../services/ProductoService';
import UnidadesMedidasService from '../../../services/UnidadesMedidasService';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setUnidadMedida } from '../../../redux/slices/UnidadMedidaReducer';
import { Field, FieldArray } from 'formik';

interface ModalProductoProps {
    modalName: string;
    initialValues: IArticuloManufacturado;
    isEditMode: boolean;
    getProductos: Function;
    productoAEditar?: IArticuloManufacturado;
}

const ModalProducto: React.FC<ModalProductoProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getProductos,
    productoAEditar,
}) => {
    const productoService = new ProductoService();
    const URL = import.meta.env.VITE_API_URL;
    const dispatch = useAppDispatch();
    const unidadMedidaService = new UnidadesMedidasService();
    const globalUnidadMedida = useAppSelector(
        (state) => state.unidadMedida.data
    );

    useEffect(() => {
        const fetchUnidadesMedida = async () => {
            try {
                const um = await unidadMedidaService.getAll(
                    `${URL}/unidadesMedidas`
                );
                dispatch(setUnidadMedida(um));
            } catch (error) {
                console.error('Error al obtener las unidades de medida:', error);
            }
        };

        fetchUnidadesMedida();
    }, [dispatch]);

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        precioVenta: Yup.number()
            .required('Campo requerido')
            .positive('El precio debe ser positivo'),
        descripcion: Yup.string().required('Campo requerido'),
        tiempoEstimadoMinutos: Yup.number()
            .required('Campo requerido')
            .positive('El tiempo debe ser positivo'),
        preparacion: Yup.string().required('Campo requerido'),
        unidadMedida: Yup.object().shape({
            denominacion: Yup.string().required('Debe seleccionar una unidad de medida'),
        }),
        articuloManufacturadoDetalles: Yup.array().of(
            Yup.object().shape({
                cantidad: Yup.number()
                    .required('Campo requerido')
                    .positive('La cantidad debe ser positiva'),
                articuloInsumo: Yup.object().shape({
                    denominacion: Yup.string().required('Debe seleccionar un artículo de insumo'),
                }),
            })
        ),
        url: Yup.string().url('Debe ser una URL válida'),
    });

    const handleSubmit = async (values: IArticuloManufacturado) => {
        try {
            if (isEditMode) {
                await productoService.put(
                    `${URL}/articulosManufacturados`,
                    values.id.toString(),
                    values
                );
            } else {
                await productoService.post(`${URL}/articulosManufacturados`, values);
            }
            getProductos();
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <GenericModal
            modalName={modalName}
            title={
                isEditMode
                    ? 'Editar Producto'
                    : 'Añadir Producto'
            }
            initialValues={productoAEditar || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
        >
            <TextFieldValue
                label="Denominación"
                name="denominacion"
                type="text"
                placeholder="Denominación"
            />
            <TextFieldValue
                label="Precio de Venta"
                name="precioVenta"
                type="number"
                placeholder="Precio de Venta"
            />
            <TextFieldValue
                label="Descripción"
                name="descripcion"
                type="text"
                placeholder="Descripción"
            />
            <TextFieldValue
                label="Tiempo Estimado (minutos)"
                name="tiempoEstimadoMinutos"
                type="number"
                placeholder="Tiempo Estimado (minutos)"
            />
            <TextFieldValue
                label="Preparación"
                name="preparacion"
                type="text"
                placeholder="Preparación"
            />
            <div>
                <Form.Label style={{ marginRight: '8px', fontWeight: 'bold' }}>
                    Unidad de Medida:
                </Form.Label>
                <Field
                    as="select"
                    name="unidadMedida.denominacion"
                    id="unidadMedida"
                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">Seleccione una unidad de medida</option>
                    {globalUnidadMedida.map((unidadMedida) => (
                        <option key={unidadMedida.id} value={unidadMedida.denominacion}>
                            {unidadMedida.denominacion}
                        </option>
                    ))}
                </Field>
            </div>
            <FieldArray name="articuloManufacturadoDetalles">
                {({ push, remove }) => (
                    <div>
                        <Form.Label style={{ fontWeight: 'bold' }}>Artículos de Insumo:</Form.Label>
                        {initialValues.articuloManufacturadoDetalles.map((_, index) => (
                            <div key={index}>
                                <TextFieldValue
                                    label="Cantidad"
                                    name={`articuloManufacturadoDetalles.${index}.cantidad`}
                                    type="number"
                                    placeholder="Cantidad"
                                />
                                <Field
                                    as="select"
                                    name={`articuloManufacturadoDetalles.${index}.articuloInsumo.denominacion`}
                                    style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                                >
                                    <option value="">Seleccione un artículo de insumo</option>
                                    {/* Aquí debes renderizar las opciones de artículos de insumo */}
                                </Field>
                                <Button variant="danger" type="button" onClick={() => remove(index)}>
                                    Eliminar
                                </Button>
                            </div>
                        ))}
                        <Button variant="primary" type="button" onClick={() => push({ cantidad: 0, articuloInsumo: { id: 0, denominacion: '' } })}>
                            Agregar Artículo de Insumo
                        </Button>
                    </div>
                )}
            </FieldArray>
            <TextFieldValue
                label="URL de la imagen"
                name="imagenes[0].url"
                type="text"
                placeholder="URL de la imagen"
            />
        </GenericModal>
    );
};

export default ModalProducto;
