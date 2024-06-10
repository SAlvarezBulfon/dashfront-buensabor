import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { MenuItem, Select, FormControl, Checkbox, FormControlLabel, Grid, Button, Typography, Card, CardMedia, CardActions, IconButton, Box } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import InsumoService from '../../../services/InsumoService';
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { InsumoPost } from '../../../types/post/InsumoPost';
import CategoriaService from '../../../services/CategoriaService';
import ImagenService from '../../../services/ImagenService';
import { Delete, PhotoCamera } from '@mui/icons-material';
import IImagen from '../../../types/IImagen';
import { IInsumo } from '../../../types/IInsumo';
import useAuthToken from '../../../hooks/useAuthToken';
import SucursalService from '../../../services/SucursalService';
import ISucursal from '../../../types/ISucursal';
import EmpresaService from '../../../services/EmpresaService';

interface ModalInsumoProps {
    modalName: string;
    initialValues: any;
    isEditMode: boolean;
    getInsumos: () => void;
    insumoAEditar?: any;
    idSucursal: number;
    onClose: () => void;
}

const ModalInsumo: React.FC<ModalInsumoProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getInsumos,
    insumoAEditar,
    idSucursal,
    onClose 
}) => {
    const insumoService = new InsumoService();
    const unidadMedidaService = new UnidadMedidaService();
    const URL = import.meta.env.VITE_API_URL;
    const categoriaService = new CategoriaService();
    const imagenService = new ImagenService();
    const sucursalService = new SucursalService();
    const empresaService = new EmpresaService();
    const getToken = useAuthToken();
    
    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<{ id: number; denominacion: string }[]>([]);
    const [unidadMedida, setUnidadMedida] = useState<number>(initialValues.idUnidadMedida || 0);
    const [categoria, setCategoria] = useState<number>(initialValues.idCategoria || 0);
    const [esParaElaborar, setEsParaElaborar] = useState<boolean>(initialValues.esParaElaborar || false);
    const [categoriaOptions, setCategoriaOptions] = useState<any[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [insumoImages, setinsumoImages] = useState<any[]>([]);
    const [disableSubmit, setDisableSubmit] = useState<boolean>(true);
    const [sucursales, setSucursales] = useState<ISucursal[]>([]);
    const [selectedSucursales, setSelectedSucursales] = useState<number[]>([]);


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
            setCategoriaOptions(categorias.filter(categoria => categoria.esInsumo));
        } catch (error) {
            console.error('Error al obtener las categorías:', error);
        }
    };
    const fetchSucursales = async () => {
        const token = await getToken();
        try {
            const sucursal = await sucursalService.get(`${URL}/sucursal`, idSucursal) as ISucursal;
            const empresaid = sucursal.empresa.id;
            const empresa = await empresaService.getById(`${URL}/empresa/sucursales`, empresaid, token);
            setSucursales(empresa.sucursales);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
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


    const showModal = (title: string, text: string, icon: SweetAlertIcon) => {
        Swal.fire({
            title: title,
            text: text,
            icon: icon,
            customClass: {
                container: "my-swal",
            },
        });
    };


    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            // Verificar si la cantidad total de imágenes (las actuales más las nuevas) supera el límite de 3
            if (insumoImages.length + files.length > 3) {
                showModal("Error", "No puedes subir más de 3 imágenes", "warning");
                event.target.value = '';
                return;
            }

            // Si no supera el límite, actualizar la lista de archivos seleccionados
            setSelectedFiles(files);
            // Calcular la cantidad total de imágenes después de agregar las nuevas
            const totalImages = insumoImages.length + files.length;
            // Habilitar el botón de submit si hay al menos una imagen seleccionada
            setDisableSubmit(totalImages === 0);
        }
    };


    const uploadImages = async (id: number) => {
        if (!selectedFiles) {
            return showModal("No hay imágenes seleccionadas", "Selecciona al menos una imagen", "warning");;
        }
        const formData = new FormData();
        Array.from(selectedFiles).forEach((file) => {
            formData.append("uploads", file);
        });

        const url = `${URL}/ArticuloInsumo/uploads?id=${id}`;

        Swal.fire({
            title: "Subiendo imágenes...",
            text: "Espere mientras se suben los archivos.",
            customClass: {
                container: 'my-swal',
            },
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
                const modal = Swal.getPopup();
                if (modal) {
                    modal.classList.add('my-swal');
                }
            },
        });

        try {
            const token = await getToken();
            const response = await imagenService.uploadImages(url, formData, token);

            if (!response.ok) {
                throw new Error('Error al subir las imágenes');
            }

            showModal("Éxito", "Imágenes subidas correctamente", "success");
        } catch (error) {
            showModal("Error", "Algo falló al subir las imágenes, inténtalo de nuevo.", "error");
            console.error("Error al subir las imágenes:", error);
        }
        setSelectedFiles(null);
    };
    useEffect(() => {
        fetchSucursales();
    }, [idSucursal]);

    const handleDeleteImg = async (url: string, uuid: string) => {
        const urlParts = url.split("/");
        const publicId = urlParts[urlParts.length - 1];

        const formData = new FormData();
        formData.append("publicId", publicId);
        formData.append("id", uuid);

        if (insumoImages.length === 1) {
            showModal("Error", "No puedes eliminar la última imagen de la empresa", "warning");
            return;
        }

        Swal.fire({
            title: "Eliminando imagen...",
            text: "Espere mientras se elimina la imagen.",
            customClass: {
                container: 'my-swal',
            },
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
        });

        try {
            const token = await getToken();
            const response = await fetch(`${URL}/ArticuloInsumo/deleteImg`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                  },
            });

            Swal.close();

            if (response.ok) {
                showModal("Éxito", "Imagen eliminada correctamente", "success");
                // Filtra la imagen eliminada de la lista
                const updatedImages = insumoImages.filter((img) => img.uuid !== uuid);
                setinsumoImages(updatedImages);
                // Vuelve a cargar las imágenes actualizadas
                getInsumos();
                onClose(); // Close the modal
            } else {
                showModal("Error", "Algo falló al eliminar la imagen, inténtalo de nuevo.", "error");
            }
        } catch (error) {
            Swal.close();
            showModal("Error", "Algo falló, contacta al desarrollador.", "error");
            console.error("Error:", error);
        }
    };



    const handleSubmit = async (values: InsumoPost) => {
        const token = await getToken();
        let id: number | null = null;
        if (!isEditMode && (!selectedFiles || selectedFiles.length === 0)) {
          Swal.fire({
            title: "Error",
            text: "Debes subir al menos una imagen",
            icon: "warning",
            customClass: {
              container: 'my-swal',
            },
          });
          return;
        }
    
        if (selectedFiles && selectedFiles.length > 3) {
          Swal.fire({
            title: "Error",
            text: "No puedes subir más de 3 imágenes",
            icon: "warning",
            customClass: {
              container: 'my-swal',
            },
          });
          return;
        }
    
      
    
        try {
        
            const insumoPost: InsumoPost = {
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
                idSucursales: selectedSucursales,
            };
    
            let response;
            
            if (isEditMode && insumoAEditar) {
                await insumoService.putSec(`${URL}/ArticuloInsumo`, insumoAEditar.id, insumoPost,token);
                id = insumoAEditar.id;
            } else {
                response = await insumoService.postSec(`${URL}/ArticuloInsumo`, insumoPost, token) as IInsumo;
                id = response.id;
            }
    
            if (id !== null) {
                if (selectedFiles) {
                    await uploadImages(id);
                }
    
                Swal.fire({
                    title: '¡Éxito!',
                    text: isEditMode ? 'Insumo editado correctamente' : 'Insumo creado correctamente',
                    icon: 'success',
                    customClass: {
                        container: 'my-swal',
                    },
                });
                getInsumos(); // Actualiza los insumos después de guardar
            } else {
                throw new Error('El ID del insumo es nulo');
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
    const handleToggleSucursal = (sucursalId: number)  => {
        if (selectedSucursales.includes(sucursalId)) {
            setSelectedSucursales(selectedSucursales.filter(id => id !== sucursalId));
        } else {
            setSelectedSucursales([...selectedSucursales, sucursalId]);
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

    useEffect(() => {
        if (isEditMode && insumoAEditar) {
            if (insumoAEditar.imagenes) {
                setinsumoImages(insumoAEditar.imagenes);
            }
        }
    }, [isEditMode, insumoAEditar]);

    useEffect(() => {
        if (isEditMode) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }, [isEditMode]);

    useEffect(() => {
        return () => {
            setSelectedFiles(null);
        };
    }, []);

    return (
        <GenericModal
            modalName={modalName}
            title={isEditMode ? 'Editar Insumo' : 'Añadir Insumo'}
            initialValues={insumoAEditar || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
            disableSubmit={disableSubmit}
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextFieldValue label="Denominación" name="denominacion" type="text" placeholder="Denominación" disabled={isEditMode} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextFieldValue label="Precio de Venta" name="precioVenta" type="number" placeholder="Precio de Venta" />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={4}>
                        <TextFieldValue label="Precio de Compra" name="precioCompra" type="number" placeholder="Precio de Compra" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextFieldValue label="Stock Actual" name="stockActual" type="number" placeholder="Stock Actual" />
                    </Grid>
                    <Grid item xs={4}>
                        <TextFieldValue label="Stock Máximo" name="stockMaximo" type="number" placeholder="Stock Máximo" />
                    </Grid>
                </Grid>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <TextFieldValue label="Stock Mínimo" name="stockMinimo" type="number" placeholder="Stock Mínimo" />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <label className='label'>Unidad de Medida</label>
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
                    </Grid>
                    <Grid item xs={12}>
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
                    </Grid>
                </Grid>
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
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        component="label"
                        startIcon={<PhotoCamera />}
                        sx={{
                            my: 2,
                            bgcolor: "#fb6376",
                            "&:hover": {
                                bgcolor: "#d73754",
                            },
                        }}
                    >
                        Subir Imágenes
                        <input
                            type="file"
                            hidden
                            onChange={handleFileChange}
                            multiple
                        />
                    </Button>
                    {isEditMode && insumoAEditar && insumoAEditar?.imagenes.length > 0 && (
                        <div>
                            <Typography variant='h5' sx={{ mb: 1 }}>Imágenes del producto</Typography>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {insumoAEditar?.imagenes.map((image: IImagen) => (
                                    <Card key={image.id} style={{ position: 'relative', width: '100px', height: '100px' }}>
                                        <CardMedia
                                            component="img"
                                            image={image.url}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <CardActions style={{ position: 'absolute', top: 0, right: 0 }}>
                                            <IconButton style={{ color: 'red' }} onClick={() => handleDeleteImg(image.url, image.id.toString())}>
                                                <Delete />
                                            </IconButton>
                                        </CardActions>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </Box>
            </div>
        </GenericModal>
    );
};

export default ModalInsumo;
