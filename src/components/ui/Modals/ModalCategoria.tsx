import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Checkbox, FormControlLabel, Button, TextField, IconButton, Stack } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import CategoriaService from '../../../services/CategoriaService';
import Swal from 'sweetalert2';
import { CategoriaPost } from '../../../types/post/CategoriaPost';
import SucursalService from '../../../services/SucursalService';
import EmpresaService from '../../../services/EmpresaService';
import ISucursal from '../../../types/ISucursal';
import ICategoria from '../../../types/ICategoria';

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
    const [esInsumo, setEsInsumo] = useState<boolean>(initialValues.esInsumo);
    const [subCategorias, setSubCategorias] = useState<ICategoria[]>(initialValues.subCategorias || []);
    const empresaService = new EmpresaService();
    const sucursalService = new SucursalService();
    const url = import.meta.env.VITE_API_URL;

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        esInsumo: Yup.boolean().required('Campo requerido'),
    });

    useEffect(() => {
        setEsInsumo(initialValues.esInsumo);
    }, [initialValues]);

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

    const handleSubmit = async (values: CategoriaPost) => {
        try {
            if (selectedSucursales.length > 0) {
                const categoriaPost: CategoriaPost = {
                    denominacion: values.denominacion,
                    esInsumo: esInsumo,
                    idSucursales: selectedSucursales,
                    subCategorias: []  // Inicialmente vacío
                };

                let response;
                let categoriaId;

                if (isEditMode && categoriaAEditar) {
                    response = await categoriaService.put(`${URL}/categoria`, categoriaAEditar.id, categoriaPost);
                    categoriaId = categoriaAEditar.id;
                } else {
                    response = await categoriaService.post(`${URL}/categoria`, categoriaPost) as ICategoria;
                    categoriaId = response.id;
                }

                if (response) {
                    // Después de crear/actualizar la categoría principal, agregar las subcategorías
                    const saveSubCategorias = async (subCategorias: ICategoria[], parentId: number) => {
                        for (const subCategoria of subCategorias) {
                            const subCategoriaPost: CategoriaPost = {
                                denominacion: subCategoria.denominacion,
                                esInsumo: subCategoria.esInsumo,
                                idSucursales: selectedSucursales,
                                subCategorias: [] 
                            };
                            const subResponse = await fetch(`${URL}/categoria/addSubCategoria/${parentId}`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(subCategoriaPost)
                            });
                            const subCategoriaData = await subResponse.json();
                            await saveSubCategorias(subCategoria.subCategorias, subCategoriaData.id);
                        }
                    };

                    await saveSubCategorias(subCategorias, categoriaId);

                    Swal.fire({
                        title: '¡Éxito!',
                        text: isEditMode ? 'Categoría editada correctamente' : 'Categoría creada correctamente',
                        icon: 'success',
                    });
                    getCategoria();
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

    const addSubCategoria = (parentIndex?: number) => {
        const newSubCategoria: ICategoria = {
            id: 0, 
            eliminado: false,
            denominacion: '',
            subCategorias: [],
            esInsumo: false,
            idSucursales: selectedSucursales
        };
        if (parentIndex !== undefined) {
            const newSubCategorias = [...subCategorias];
            newSubCategorias[parentIndex].subCategorias.push(newSubCategoria);
            setSubCategorias(newSubCategorias);
        } else {
            setSubCategorias([...subCategorias, newSubCategoria]);
        }
    };

    const removeSubCategoria = (index: number, parentIndex?: number) => {
        if (parentIndex !== undefined) {
            const newSubCategorias = [...subCategorias];
            newSubCategorias[parentIndex].subCategorias = newSubCategorias[parentIndex].subCategorias.filter((_, i) => i !== index);
            setSubCategorias(newSubCategorias);
        } else {
            setSubCategorias(subCategorias.filter((_, i) => i !== index));
        }
    };

    const renderSubCategorias = (subCategorias: ICategoria[], parentIndex?: number) => {
        return subCategorias.map((subCategoria, index) => (
            <div key={index} style={{ marginLeft: parentIndex !== undefined ? '20px' : '0px', marginTop: '10px' }}>
                <Stack direction="row" alignItems="center" spacing={6}>
                    <TextField
                        label={`Denominación Subcategoría`}
                        size="small"
                        value={subCategoria.denominacion}
                        onChange={(e) => {
                            const newSubCategorias = [...subCategorias];
                            newSubCategorias[index].denominacion = e.target.value;
                            if (parentIndex !== undefined) {
                                const newParentSubCategorias = [...subCategorias];
                                newParentSubCategorias[parentIndex].subCategorias = newSubCategorias;
                                setSubCategorias(newParentSubCategorias);
                            } else {
                                setSubCategorias(newSubCategorias);
                            }
                        }}
                    />
                    <IconButton size="small" onClick={() => addSubCategoria(index)}>
                        <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                    <Button size="small" onClick={() => removeSubCategoria(index, parentIndex)}>Eliminar</Button>
                </Stack>
                {subCategoria.subCategorias && renderSubCategorias(subCategoria.subCategorias, index)}
            </div>
        ));
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
                <Stack direction="row" alignItems="center" spacing={1}>
                    <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Denominación" />
                    <IconButton size="small" onClick={() => addSubCategoria()}>
                        <AddCircleOutlineIcon fontSize="small" />
                    </IconButton>
                </Stack>
                <>
                    <p>Subcategorías:</p>
                    {renderSubCategorias(subCategorias)}
                </>
                <FormControlLabel
                    control={
                        <Checkbox
                            name="esInsumo"
                            checked={esInsumo}
                            onChange={() => setEsInsumo(!esInsumo)}
                            disabled={isEditMode}
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
