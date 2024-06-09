import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Container, Stack, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { setPromociones } from '../../../redux/slices/PromocionReducer';
import { toggleModal } from '../../../redux/slices/ModalReducer';
import EmptyState from '../../ui/Cards/EmptyState/EmptyState';
import SearchBar from '../../ui/common/SearchBar/SearchBar';
import { useParams } from 'react-router-dom';
import { handleSearch } from '../../../utils/utils';
import CardPromocion from '../../ui/Cards/CardPromocion/CardPromocion';
import SucursalService from '../../../services/SucursalService';
import { TipoPromocion } from '../../../types/enums/TipoPromocion';
import ModalPromocion from '../../ui/Modals/ModalPromocion';
import IPromocion from '../../../types/IPromocion';
import PromocionPost from '../../../types/post/PromocionPost';
import useAuthToken from '../../../hooks/useAuthToken';

const Promocion: React.FC = () => {
    const url = import.meta.env.VITE_API_URL;
    const dispatch = useAppDispatch();
    const globalPromociones = useAppSelector((state) => state.promocion.data);
    const { sucursalId } = useParams<{ sucursalId: string }>();
    const sucursalService = new SucursalService();
    const [selectedPromocion, setSelectedPromocion] = useState<any>();
    const [filteredData, setFilteredData] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const getToken = useAuthToken();
    const fetchPromociones = async () => {
        try {
            setIsLoading(true);
            const token = await getToken();
            if (sucursalId !== undefined) {
                const promociones = await sucursalService.getById(`${url}/sucursal/getPromociones`, parseInt(sucursalId), token) as any;
                dispatch(setPromociones(promociones));
                setFilteredData(promociones);
            }
        } catch (error) {
            console.error("Error al obtener las promociones:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPromociones();
    }, [dispatch, url, sucursalId]);

    const initialValue: PromocionPost = {
        denominacion: "",
        fechaDesde: "",
        fechaHasta: "",
        horaDesde: "",
        horaHasta: "",
        descripcionDescuento: "",
        precioPromocional: 0,
        tipoPromocion: TipoPromocion.PROMOCION,
        idSucursales: [0],
        detalles: [{ cantidad: 0, idArticulo: 0 }]
    };

    const onSearch = (query: string) => {
        handleSearch(query, globalPromociones, 'denominacion', setFilteredData);
    };

    const handleEdit = (promocion: IPromocion) => {
        if (promocion) {
            setIsEditing(true);
            setSelectedPromocion(promocion);
            dispatch(toggleModal({ modalName: "modalPromocion" }));
        }
    };

    const handleAddPromocion = () => {
        setIsEditing(false);
        setSelectedPromocion(initialValue);
        dispatch(toggleModal({ modalName: "modalPromocion" }));
    };

    const handleViewDetails = (promocion: any) => {
        setSelectedPromocion(promocion);
        dispatch(toggleModal({ modalName: "modalPromoDetail" }));
    };

    const renderPromociones = (promociones: IPromocion[]) => {
        return (
            <Grid container spacing={2}>
                {promociones.map((promocion, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <CardPromocion
                            promocion={promocion}
                            onEdit={() => handleEdit(promocion)}
                            onViewDetails={() => handleViewDetails(promocion)}
                        />
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Box sx={{ maxWidth: 1150, margin: '0 auto', padding: 2, my: 10 }}>
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h4">Promociones</Typography>
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
                        onClick={handleAddPromocion}
                    >
                        Añadir Promoción
                    </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SearchBar onSearch={onSearch} />
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                        <CircularProgress sx={{ color: '#fb6376' }} />
                    </Box>
                ) : filteredData.length === 0 ? (
                    <EmptyState
                        title="No hay promociones cargadas"
                        description="Agrega nuevas promociones utilizando el formulario."
                    />
                ) : (


                    <Stack direction="column" spacing={1} mt={2}>
                        {renderPromociones(filteredData)}
                    </Stack>

                )}
            </Container>
            {sucursalId &&
                <ModalPromocion
                    modalName="modalPromocion"
                    initialValues={selectedPromocion || initialValue}
                    isEditMode={isEditing}
                    fetchPromociones={fetchPromociones}
                    promocionAEditar={selectedPromocion}
                    idSucursal={parseInt(sucursalId)}
                    onClose={() => dispatch(toggleModal({ modalName: "modalPromocion" }))}
                />
            }
        </Box>
    );
};

export default Promocion;
