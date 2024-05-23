import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Container, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import  ICategoria  from '../../../types/ICategoria';
import { setCategoria } from '../../../redux/slices/CategoriaReducer';
import { CategoriaPost } from '../../../types/post/CategoriaPost';
import { handleSearch } from '../../../utils/utils';
import { toggleModal } from '../../../redux/slices/ModalReducer';
import EmptyState from '../../ui/Cards/EmptyState/EmptyState';
import SearchBar from '../../ui/common/SearchBar/SearchBar';
import ModalCategoria from '../../ui/Modals/ModalCategoria';
import { useParams } from 'react-router-dom';
import SucursalService from '../../../services/SucursalService';
import SimpleCategoriaAccordion from '../../ui/accordion/CategoriaAccordion';


const Categoria: React.FC = () => {
    const url = import.meta.env.VITE_API_URL;
    const dispatch = useAppDispatch();
    const globalCategorias = useAppSelector((state) => state.categoria.data);
    const { idSucursal } = useParams<{ idSucursal: string }>();
    let sucursalid = 0;
    if(idSucursal){
        sucursalid = parseInt(idSucursal);
    }
    const sucursalService = new SucursalService();
    const [selectedCategory, setSelectedCategory] = useState<ICategoria | CategoriaPost>();
    const [filteredData, setFilteredData] = useState<ICategoria[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategoria = async () => {
        try {
            setIsLoading(true);
            if (idSucursal !== undefined) {
                const categorias = await sucursalService.get(`${url}/sucursal/getCategorias`, parseInt(idSucursal)) as any;
                dispatch(setCategoria(categorias));
                setFilteredData(categorias);
            }
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoria();
    }, [dispatch, url, idSucursal]);

    const initialValue: CategoriaPost = {
        denominacion: "",
        esInsumo: false,
        idSucursales: [0],
        subCategorias: []
    };

    const onSearch = (query: string) => {
        handleSearch(query, globalCategorias, 'denominacion', setFilteredData);
    };

    const handleEdit = (categoria: ICategoria) => {
        if (categoria) {
            setIsEditing(true);
            setSelectedCategory(categoria);
            dispatch(toggleModal({ modalName: "modalCategoria" }));
        }
    };

    const handleAddCategoria = () => {
        setIsEditing(false);
        setSelectedCategory(initialValue);
        dispatch(toggleModal({ modalName: "modalCategoria" }));
    };


    const renderCategorias = (categorias: ICategoria[], order: number) => {
        return categorias.map((categoria, index) => {
            if (categoria.eliminado) {
                return null;
            }
            return (
                <SimpleCategoriaAccordion
                    key={index}
                    categoria={categoria}
                    order={order}
                    onEdit={handleEdit}
                />
            );
        });
    };


    return (
        <Box sx={{ maxWidth: 1150, margin: '0 auto', padding: 2, my: 10 }}>
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4">Categoría</Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        sx={{
                            backgroundColor: '#fb6376',
                            "&:hover": {
                                bgcolor: "#d73754",
                            },
                        }}
                        onClick={handleAddCategoria}
                    >
                        Añadir Categoría
                    </Button>
                </Box>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                        <CircularProgress sx={{ color: '#fb6376' }} />
                    </Box>
                ) : filteredData.length === 0 ? (
                    <EmptyState
                        title="No hay categorias cargadas"
                        description="Agrega nuevas categorias utilizando el formulario."
                    />
                ) : (
                    <>
                        <Box sx={{ mt: 2 }}>
                            <SearchBar onSearch={onSearch} />
                        </Box>
                        <Stack direction="column" spacing={1} mt={2}>
                            {renderCategorias(filteredData, 0)}
                        </Stack>
                    </>
                )}
            </Container>
            {idSucursal &&
                <ModalCategoria
                    modalName="modalCategoria"
                    initialValues={selectedCategory || initialValue}
                    isEditMode={isEditing}
                    getCategoria={fetchCategoria}
                    categoriaAEditar={isEditing ? selectedCategory : undefined}
                    idSucursal={sucursalid}
                />}
        </Box>
    );
};

export default Categoria;
