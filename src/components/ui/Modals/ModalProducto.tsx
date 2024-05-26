import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { Box, MenuItem, Select, FormControl, TextField, Button, Typography, Grid, Card, CardMedia, CardActions, IconButton } from '@mui/material';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import ProductoService from '../../../services/ProductoService';
import IProducto from '../../../types/IProducto';
import UnidadMedidaService from '../../../services/UnidadMedidaService';
import ProductoDetalleService from '../../../services/ProductoDetalleService';
import InsumoService from '../../../services/InsumoService';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import '../TextFieldValue/textFieldValue.css';
import Column from '../../../types/Column';
import IProductoDetalle from '../../../types/IProductoDetalle';
import '../../../utils/swal.css';
import CategoriaService from '../../../services/CategoriaService';
import { IInsumo } from '../../../types/IInsumo';
import TableComponent from '../Tables/Table/TableComponent';
import ImagenService from '../../../services/ImagenService';
import { Delete, PhotoCamera } from '@mui/icons-material';

interface ModalProductoProps {
    modalName: string;
    initialValues: any;
    isEditMode: boolean;
    getProductos: Function;
    productoAEditar?: IProducto;
    onClose: () => void;
}

const ModalProducto: React.FC<ModalProductoProps> = ({
    modalName,
    initialValues,
    isEditMode,
    getProductos,
    productoAEditar,
    onClose,
}) => {
    const productoService = new ProductoService();
    const productoDetalleService = new ProductoDetalleService();
    const unidadMedidaService = new UnidadMedidaService();
    const insumoService = new InsumoService();
    const categoriaService = new CategoriaService();
    const imagenService = new ImagenService();
    const URL = import.meta.env.VITE_API_URL;

    const [unidadMedidaOptions, setUnidadMedidaOptions] = useState<{ id: number; denominacion: string }[]>([]);
    const [insumos, setInsumos] = useState<any[]>([]);
    const [dataIngredients, setDataIngredients] = useState<any[]>([]);
    const [selectedInsumoId, setSelectedInsumoId] = useState<number | null>(null);
    const [cantidadInsumo, setCantidadInsumo] = useState<number>(0);
    const [unidadMedidaInsumo, setUnidadMedidaInsumo] = useState<string>('N/A');
    const [unidadMedidaProducto, setUnidadMedidaProducto] = useState<number>(initialValues.idUnidadMedida || 0);
    const [categoriasInsumo, setCategoriasInsumo] = useState<any[]>([]);
    const [selectedCategoria, setSelecteCategoria] = useState<number | null>(null);
    const [categoriaProductoOptions, setCategoriaProductoOptions] = useState<any[]>([]);
    const [categoriaProducto, setCategoriaProducto] = useState<number | ''>('');
    const [articuloImages, setArticuloImages] = useState<any[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
    const [disableSubmit, setDisableSubmit] = useState<boolean>(true);

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
            if (articuloImages.length + files.length > 3) {
                showModal("Error", "No puedes subir más de 3 imágenes", "warning");
                event.target.value = '';
                return;
            }

            // Si no supera el límite, actualizar la lista de archivos seleccionados
            setSelectedFiles(files);
            // Calcular la cantidad total de imágenes después de agregar las nuevas
            const totalImages = articuloImages.length + files.length;
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

        const url = `${URL}/ArticuloManufacturado/uploads?id=${id}`;

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
            const response = await imagenService.uploadImages(url, formData);

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

    const handleDeleteImg = async (url: string, uuid: string) => {
        const urlParts = url.split("/");
        const publicId = urlParts[urlParts.length - 1];

        const formData = new FormData();
        formData.append("publicId", publicId);
        formData.append("id", uuid);

        if (articuloImages.length === 1) {
            showModal("Error", "No puedes eliminar la última imagen del Producto", "warning");
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
            const response = await fetch(`${URL}/ArticuloManufacturado/deleteImg`, {
                method: "POST",
                body: formData,
            });

            Swal.close();

            if (response.ok) {
                showModal("Éxito", "Imagen eliminada correctamente", "success");
                // Filtra la imagen eliminada de la lista
                const updatedImages = articuloImages.filter((img) => img.uuid !== uuid);
                setArticuloImages(updatedImages);
                // Vuelve a cargar las imágenes actualizadas
                getProductos();
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


    const fetchUnidadesMedida = async () => {
        try {
            const unidadesMedida = await unidadMedidaService.getAll(`${URL}/UnidadMedida`);
            setUnidadMedidaOptions(unidadesMedida);
        } catch (error) {
            console.error('Error al obtener las unidades de medida:', error);
        }
    };

    const fetchProductoDetalle = async () => {
        if (productoAEditar) {
            try {
                const detalles = await productoDetalleService.getAll(`${URL}/ArticuloManufacturado/allDetalles/${productoAEditar.id}`);
                setDataIngredients(detalles);
            } catch (error) {
                console.error('Error al obtener los detalles del producto:', error);
            }
        }
    };

    const fetchCategoria = async () => {
        try {
            const categorias = await categoriaService.getAll(URL + '/categoria');
            setCategoriasInsumo(categorias.filter(categoria => categoria.esInsumo));
            setCategoriaProductoOptions(categorias.filter(categoria => !categoria.esInsumo));
        } catch (error) {
            console.error('Error al obtener las categorías de producto:', error);
        }
    };


    const fetchInsumos = async () => {
        try {
            const insumos = await insumoService.getAll(`${URL}/ArticuloInsumo`);
            setInsumos(insumos);
        } catch (error) {
            console.error('Error al obtener los insumos:', error);
        }
    };

    const validationSchema = Yup.object().shape({
        denominacion: Yup.string().required('Campo requerido'),
        descripcion: Yup.string().required('Campo requerido'),
        tiempoEstimadoMinutos: Yup.number().required('Campo requerido'),
        preparacion: Yup.string().required('Campo requerido'),
        precioVenta: Yup.number().required('Campo requerido'),
    });

    const onDeleteProductoDetalle = async (productoDetalle: IProductoDetalle) => {
        try {
            if (isEditMode && productoAEditar) {
                // Si está en modo de edición, usamos el servicio para eliminar el detalle del producto de la base de datos
                await productoDetalleService.delete(`${URL}/ArticuloManufacturadoDetalle`, productoDetalle.id);
            }
            //actualizamos el estado eliminando el detalle
            const updatedIngredients = dataIngredients.filter((ingredient) => ingredient.id !== productoDetalle.id);
            setDataIngredients(updatedIngredients);

            Swal.fire({
                title: '¡Éxito!',
                text: 'Ingrediente eliminado correctamente',
                icon: 'success',
                customClass: {
                    container: 'my-swal',
                },
            });
        } catch (error) {
            console.error('Error al eliminar el ingrediente:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ha ocurrido un error al eliminar el ingrediente',
                icon: 'error',
                customClass: {
                    container: 'my-swal',
                },
            });
        }
    };

    const handleNewIngredient = async () => {
        if (selectedInsumoId !== null && cantidadInsumo > 0) {
            try {
                const newDetalle = {
                    cantidad: cantidadInsumo,
                    idArticuloInsumo: selectedInsumoId,
                };

                const createdDetalle = await productoDetalleService.post(`${URL}/ArticuloManufacturadoDetalle`, newDetalle);

                setDataIngredients([...dataIngredients, createdDetalle]);

                setSelectedInsumoId(null);
                setCantidadInsumo(0);
                setUnidadMedidaInsumo('N/A');
            } catch (error) {
                console.error('Error al crear el detalle:', error);
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error al crear el detalle',
                    icon: 'error',
                    customClass: {
                        container: 'my-swal',
                    },
                });
            }
        }
    };

    const columns: Column[] = [
        {
            id: "ingrediente",
            label: "",
            renderCell: (element) => (
                <Typography variant="h6" fontWeight="bold">
                    {element?.articuloInsumo?.denominacion || 'N/A'}
                </Typography>
            )
        },
        {
            id: "cantidadYUnidadMedida",
            label: "",
            renderCell: (element) => (
                <>
                    {element?.cantidad || 'N/A'} {element?.articuloInsumo?.unidadMedida?.denominacion || 'N/A'}
                </>
            )
        }
    ];

    const handleSubmit = async (values: IProducto) => {
        try {
            const productoPost = {
                denominacion: values.denominacion,
                descripcion: values.descripcion,
                tiempoEstimadoMinutos: values.tiempoEstimadoMinutos,
                precioVenta: values.precioVenta,
                preparacion: values.preparacion,
                idUnidadMedida: unidadMedidaProducto,
                idCategoria: categoriaProducto,
                articuloManufacturadoDetalles: dataIngredients.map((detalle) => {
                    return {
                        cantidad: detalle.cantidad,
                        idArticuloInsumo: detalle.articuloInsumo.id,
                    };
                }),
            };

            let response;
            let id: number | null = null;

            if (isEditMode && productoAEditar) {
                const productoPut = {
                    ...productoPost,
                    detalles: dataIngredients.map((detalle) => {
                        return {
                            cantidad: detalle.cantidad,
                            idArticuloInsumo: detalle.articuloInsumo.id,
                        };
                    }),
                };
                await productoService.put(`${URL}/ArticuloManufacturado`, productoAEditar.id, productoPut);
                id = productoAEditar.id;
            } else {
                response = await productoService.post(`${URL}/ArticuloManufacturado`, productoPost) as IProducto;
                id = response.id;
            }

            if (id !== null) {
                if (selectedFiles) {
                    await uploadImages(id);
                }

                Swal.fire({
                    title: '¡Éxito!',
                    text: isEditMode ? 'Producto editado correctamente' : 'Producto creado correctamente',
                    icon: 'success',
                    customClass: {
                        container: 'my-swal',
                    },
                });
                await getProductos(); // Actualiza los productos después de guardar
            } else {
                throw new Error('El ID del producto es nulo');
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

            if (!isEditMode) {
                try {
                    await Promise.all(dataIngredients.map(async (detalle) => {
                        await productoDetalleService.delete(`${URL}/ArticuloManufacturadoDetalle`, detalle.id);
                    }));
                } catch (rollbackError) {
                    console.error('Error al realizar el rollback:', rollbackError);
                }
            }
        }
    };

    useEffect(() => {
        fetchCategoria();
        fetchUnidadesMedida();
        fetchInsumos();
        if (!isEditMode) {
            setDataIngredients([]);
        }
        if (isEditMode && productoAEditar) {
            fetchProductoDetalle();
            setUnidadMedidaProducto(productoAEditar.idUnidadMedida);
        }
    }, [isEditMode, productoAEditar]);

    useEffect(() => {
        if (selectedInsumoId !== null) {
            const selectedInsumo = insumos.find((insumo) => insumo.id === selectedInsumoId);
            if (selectedInsumo) {
                setUnidadMedidaInsumo(selectedInsumo.unidadMedida.denominacion);
            }
        } else {
            setUnidadMedidaInsumo('N/A');
        }
    }, [selectedInsumoId, insumos]);

    return (
        <GenericModal
            modalName={modalName}
            title={isEditMode ? 'Editar Producto' : 'Añadir Producto'}
            initialValues={productoAEditar || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
            disableSubmit={disableSubmit}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                    <TextFieldValue label="Nombre" name="denominacion" type="text" placeholder="Nombre" disabled={isEditMode} />
                </Grid>
                <Grid item xs={4}>
                    <TextFieldValue label="Descripción" name="descripcion" type="text" placeholder="Descripción" />
                </Grid>
                <Grid item xs={4}>
                    <TextFieldValue label="Precio de venta" name="precioVenta" type="number" placeholder="Precio" />
                </Grid>
            </Grid>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={4}>
                    <TextFieldValue label="Tiempo Estimado (minutos)" name="tiempoEstimadoMinutos" type="number" placeholder="Tiempo Estimado" />
                </Grid>
                <Grid item xs={4}>
                    <Box mt={2}>
                        <FormControl fullWidth>
                            <label className='label' style={{ color: 'grey' }}>Unidad de Medida del Producto</label>
                            <Select
                                labelId="unidadMedidaProductoLabel"
                                id="unidadMedidaProducto"
                                value={unidadMedidaProducto}
                                onChange={(e) => setUnidadMedidaProducto(e.target.value as number)}
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
                    </Box>
                </Grid>
                <Grid item xs={4}>
                    <Box mt={2}>
                        <FormControl fullWidth>
                            <label className='label' style={{ color: 'grey' }}>Categoría del Producto</label>
                            <Select
                                labelId="categoriaProductoLabel"
                                id="categoriaProducto"
                                value={categoriaProducto}
                                onChange={(e) => setCategoriaProducto(e.target.value as number | '')}
                                displayEmpty
                                disabled={isEditMode}
                            >
                                <MenuItem disabled value="">
                                    Seleccione una categoría de producto
                                </MenuItem>
                                {categoriaProductoOptions.map((categoria) => (
                                    <MenuItem key={categoria.id} value={categoria.id}>
                                        {categoria.denominacion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                    </Box>
                </Grid>
            </Grid>

            <TextFieldValue label="Preparación" name="preparacion" type="textarea" placeholder="Preparación" />
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
                {isEditMode && productoAEditar && productoAEditar?.imagenes.length > 0 && (
                    <div>
                        <Typography variant='h5' sx={{ mb: 1 }}>Imágenes del producto</Typography>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {productoAEditar?.imagenes.map((image) => (
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


            <Typography variant="h6" align="center" gutterBottom sx={{ my: 2 }}>
                Ingredientes
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2vh' }}>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <Select
                                labelId="categoriasInsumoLabel"
                                id="categoriasInsumo"
                                value={selectedCategoria || ''}
                                onChange={(e) => {
                                    setSelecteCategoria(e.target.value as number);
                                    setSelectedInsumoId(null);  // Reset insumo selection
                                    setUnidadMedidaInsumo('N/A');  // Reset unidad de medida
                                }}
                                displayEmpty
                            >
                                <MenuItem disabled value="">
                                    Seleccione una categoría de insumo
                                </MenuItem>
                                {categoriasInsumo.map((categoria) => (
                                    <MenuItem key={categoria.id} value={categoria.id}>
                                        {categoria.denominacion}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <Select
                                value={selectedInsumoId || ''}
                                onChange={(e) => setSelectedInsumoId(e.target.value as number)}
                                displayEmpty
                                disabled={!selectedCategoria}
                            >
                                <MenuItem value="" disabled>
                                    Seleccione un ingrediente
                                </MenuItem>
                                {categoriasInsumo
                                    .find(categoria => categoria.id === selectedCategoria)
                                    ?.insumos.map((insumo: IInsumo) => (
                                        <MenuItem key={insumo.id} value={insumo.id}>
                                            {insumo.denominacion}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            type="text"
                            label="Unidad de Medida"
                            value={unidadMedidaInsumo}
                            variant="filled"
                            disabled
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <TextField
                            type="number"
                            label="Cantidad"
                            value={cantidadInsumo}
                            onChange={(e) => setCantidadInsumo(parseFloat(e.target.value))}
                            variant="filled"
                            disabled={!selectedInsumoId}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button
                            onClick={handleNewIngredient}
                            variant="contained"
                            color="primary"
                            disabled={!selectedInsumoId || cantidadInsumo <= 0}
                            style={{ backgroundColor: '#e91e63', color: '#fff' }}
                        >
                            Añadir
                        </Button>
                    </Grid>
                </Grid>
            </Box>
            <TableComponent
                data={dataIngredients}
                columns={columns}
                onDelete={onDeleteProductoDetalle}
            />
        </GenericModal>
    );
};

export default ModalProducto;
