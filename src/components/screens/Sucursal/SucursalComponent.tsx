import { useEffect, useState } from "react";
import { Box, Typography, Button, Container, CircularProgress, Grid, Tooltip } from '@mui/material';
import { Add, ArrowBack } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import EmpresaService from '../../../services/EmpresaService';
import { toggleModal } from '../../../redux/slices/ModalReducer';
import { handleSearch, onDelete } from '../../../utils/utils';
import SearchBar from '../../ui/common/SearchBar/SearchBar';
import { setSucursal } from '../../../redux/slices/SucursalReducer';
import ModalSucursal from '../../ui/Modals/ModalSucursal';
import SucursalService from '../../../services/SucursalService';
import IEmpresa from "../../../types/IEmpresa";
import SucursalPost from "../../../types/post/SucursalPost";
import ISucursal from "../../../types/ISucursal";
import EmptyState from "../../ui/Cards/EmptyState/EmptyState";
import CardSucursal from "../../ui/Cards/CardSucursal/CardSucursal";
import NoResults from "../../ui/Cards/NoResults/NoResults";
import useAuthToken from "../../../hooks/useAuthToken";


type SucursalWithId = ISucursal & { id: number }; // Definir un tipo que tenga la propiedad id

const SucursalesEmpresa = () => {
    const { empresaId } = useParams<{ empresaId: string }>();
    const [nombreEmpresa, setNombreEmpresa] = useState<string>('');
    const [empresa, setEmpresa] = useState<IEmpresa>();
    const getToken = useAuthToken();
    const dispatch = useAppDispatch();
    const empresaService = new EmpresaService();
    const sucursalService = new SucursalService();
    const url = import.meta.env.VITE_API_URL;
    const sucursalesEmpresa = useAppSelector((state) => state.sucursal.data);
    const [filteredData, setFilteredData] = useState<(ISucursal | SucursalPost)[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [sucursalEditar, setSucursalEditar] = useState<ISucursal | SucursalPost>();
    const [casaMatrizDisabled, setCasaMatrizDisabled] = useState<boolean>(false);
    const navigate = useNavigate();

    const fetchSucursal = async () => {
        try {
            setIsLoading(true);
            if (empresaId !== undefined) {
                const token = await getToken();
                const empresa = await empresaService.getById(`${url}/empresa/sucursales`, parseInt(empresaId), token) as IEmpresa;
                dispatch(setSucursal(empresa.sucursales));
                setFilteredData(empresa.sucursales);
                setNombreEmpresa(empresa.nombre);
                setEmpresa(empresa);
                const hasCasaMatriz = empresa.sucursales.some((sucursal: ISucursal) => sucursal.esCasaMatriz);
                setCasaMatrizDisabled(hasCasaMatriz);
                setIsLoading(false);
            } else {
                console.error("Error: empresaId es undefined");
            }
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
        }
    };

    useEffect(() => {
        fetchSucursal();
    }, [empresaId, url, dispatch]);

    const onSearch = (query: string) => {
        handleSearch(query, sucursalesEmpresa, 'nombre', setFilteredData);
    };

    const onDeleteSucursal = async (sucursal: ISucursal) => {
        try {
            await onDelete(
                sucursal,
                async (sucursalToDelete: ISucursal) => {
                    await sucursalService.delete(url + '/sucursal', sucursalToDelete.id);
                },
                fetchSucursal,
                () => {
                    navigate(0); 
                },
                (error: any) => {
                    console.error("Error al eliminar sucursal:", error);
                }
            );
        } catch (error) {
            console.error("Error al eliminar sucursal:", error);
        }
    };

    const handleEdit = (sucursal: ISucursal) => {
        setIsEditing(true);
        setSucursalEditar(sucursal);
        dispatch(toggleModal({ modalName: "modal" }));
    };

    const handleAddSucursal = () => {
        setIsEditing(false);
        setSucursalEditar(undefined);
        dispatch(toggleModal({ modalName: "modal" }));
    };

    const generateInitialSucursal = (idEmpresa: number): SucursalPost => {
        return {
            nombre: '',
            horarioApertura: '',
            horarioCierre: '',
            domicilio: {
                calle: '',
                numero: 0,
                cp: 0,
                piso: 0,
                nroDpto: 0,
                idLocalidad: 0,
            },
            idEmpresa: idEmpresa,
            esCasaMatriz: false
        };
    };

    return (
        <Box
            component="main"
            sx={{
                flexGrow: 1,
                my: 12,
            }}>
            <Container>
                <Tooltip title="Volver" arrow>
                    <ArrowBack
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate(-1)}
                    />
                </Tooltip>

                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
                    <Typography variant="h5" gutterBottom>
                        Sucursales de {nombreEmpresa}
                    </Typography>
                    <Button
                        onClick={handleAddSucursal}
                        sx={{
                            bgcolor: "#fb6376",
                            "&:hover": {
                                bgcolor: "#d73754",
                            },
                        }}
                        variant="contained"
                        startIcon={<Add />}
                    >
                        Sucursales
                    </Button>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SearchBar onSearch={onSearch} />
                </Box>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                        <CircularProgress sx={{ color: '#fb6376' }} />
                    </Box>
                ) : (
                    <Grid container spacing={2} sx={{ minHeight: '60vh' }}>
                        {sucursalesEmpresa.length === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <EmptyState
                                    title="No hay sucursales disponibles"
                                    description={`Parece que aún no has creado ninguna sucursal en ${empresa?.nombre}. ¿Por qué no crear una ahora?`}
                                />
                            </Box>
                        ) : filteredData.length === 0 ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                                <NoResults />
                            </Box>
                        ) : (
                            filteredData.map((sucursal) => (
                                'id' in sucursal && (
                                    <Grid item xs={12} sm={6} md={4} key={sucursal.id}>
                                        <CardSucursal sucursal={sucursal as SucursalWithId} onEdit={handleEdit} onDelete={onDeleteSucursal} />
                                    </Grid>
                                )
                            ))
                        )}
                    </Grid>
                )}
                <ModalSucursal
                    modalName="modal"
                    initialValues={sucursalEditar || generateInitialSucursal(empresa?.id || 0)}
                    isEditMode={isEditing}
                    getSucursales={fetchSucursal}
                    idEmpresa={empresa?.id || 0}
                    casaMatrizDisabled={casaMatrizDisabled}
                />
            </Container>
        </Box>
    );
};

export default SucursalesEmpresa;
