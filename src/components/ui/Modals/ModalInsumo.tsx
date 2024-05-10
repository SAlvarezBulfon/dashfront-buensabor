import React, { useEffect } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import IArticuloInsumo from '../../../types/ArticuloInsumo';
import InsumoService from '../../../services/InsumoService';
import UnidadesMedidasService from '../../../services/UnidadesMedidasService';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setUnidadMedida } from '../../../redux/slices/UnidadMedidaReducer';
import { Field } from 'formik';

interface ModalInsumoProps {
    modalName: string;
    initialValues: IArticuloInsumo;
    isEditMode: boolean;
    getInsumos: Function;
    insumoAEditar?: IArticuloInsumo;
}

const ModalInsumo: React.FC<ModalInsumoProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getInsumos,
    insumoAEditar,
}) => {
    const insumoService = new InsumoService();
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
        precioCompra: Yup.number()
            .required('Campo requerido')
            .positive('El precio debe ser positivo'),
        stockActual: Yup.number()
            .required('Campo requerido')
            .integer('El stock debe ser un número entero')
            .min(Yup.ref('stockMinimo'), 'El stock no puede ser menor que el stock mínimo')
            .max(Yup.ref('stockMaximo'), 'El stock no puede ser mayor que el stock máximo')
            .min(0, 'El stock debe ser mayor o igual a 0'),
        stockMaximo: Yup.number()
            .required('Campo requerido')
            .integer('El stock debe ser un número entero')
            .min(0, 'El stock máximo debe ser mayor o igual a 0'),
        stockMinimo: Yup.number()
            .required('Campo requerido')
            .integer('El stock debe ser un número entero')
            .min(0, 'El stock mínimo debe ser mayor o igual a 0'),
        esParaElaborar: Yup.boolean().required('Campo requerido'),
        url: Yup.string().url('Debe ser una URL válida'),
    });

    const handleSubmit = async (values: IArticuloInsumo) => {
        try {
            if (isEditMode) {
                await insumoService.put(
                    `${URL}/articulosInsumos`,
                    values.id.toString(),
                    values
                );
            } else {
                await insumoService.post(`${URL}/articulosInsumos`, values);
            }
            getInsumos();
        } catch (error) {
            console.error('Error al enviar los datos:', error);
        }
    };

    return (
        <GenericModal
            modalName={modalName}
            title={
                isEditMode
                    ? 'Editar Artículo de Insumo'
                    : 'Añadir Artículo de Insumo'
            }
            initialValues={insumoAEditar || initialValues}
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
            <div>
                <label htmlFor="unidadMedida" style={{ marginRight: '8px', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Unidad de Medida:
                </label>
                <Field
                    as="select"
                    name="unidadMedida.denominacion"
                    id="unidadMedida"
                    style={{ padding: '6px', paddingRight: '208px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '1rem' }}
                >
                    <option value="">Seleccione una unidad de medida</option>
                    {globalUnidadMedida.map((unidadMedida) => (
                        <option key={unidadMedida.id} value={unidadMedida.denominacion}>
                            {unidadMedida.denominacion}
                        </option>
                    ))}
                </Field>
            </div>
            <TextFieldValue
                label="Precio de Venta"
                name="precioVenta"
                type="number"
                placeholder="Precio de Venta"
            />
            <TextFieldValue
                label="Precio de Compra"
                name="precioCompra"
                type="number"
                placeholder="Precio de Compra"
            />
            <TextFieldValue
                label="Stock Actual"
                name="stockActual"
                type="number"
                placeholder="Stock Actual"
            />
            <TextFieldValue
                label="Stock Máximo"
                name="stockMaximo"
                type="number"
                placeholder="Stock Máximo"
            />
            <TextFieldValue
                label="Stock Mínimo"
                name="stockMinimo"
                type="number"
                placeholder="Stock Mínimo"
            />

            <TextFieldValue
                label="URL de la imagen"
                name="imagenes[0].url"
                type="text"
                placeholder="URL de la imagen"
            />

            <div>
                <label
                    htmlFor="esParaElaborar"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        marginRight: '16px',
                        cursor: 'pointer',
                    }}
                >
                    <Field
                        type="checkbox"
                        name="esParaElaborar"
                        id="esParaElaborar"
                        style={{ marginRight: '8px' }}
                    />
                    Es para elaborar
                </label>
            </div>
        </GenericModal>


    );
};

export default ModalInsumo;