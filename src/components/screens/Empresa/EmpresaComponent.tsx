import { Box, Typography, Button, Container, CircularProgress } from "@mui/material";
import { AddCircle, Visibility } from "@mui/icons-material";
import EditIcon from '@mui/icons-material/Edit';
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setEmpresa } from "../../../redux/slices/EmpresaReducer";
import '../../../utils/swal.css'
import EmpresaService from "../../../services/EmpresaService";
import Empresa from "../../../types/IEmpresa";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import ModalEmpresa from "../../ui/Modals/ModalEmpresa";
import ModalSucursal from "../../ui/Modals/ModalSucursal";
import GenericCard from "../../ui/Cards/GenericCard/GenericCard";
import { useEffect, useState } from "react";
import SucursalPost from "../../../types/post/SucursalPost";
import AddButton from "../../ui/Buttons/AddButton";
import EmptyState from "../../ui/Cards/EmptyState/EmptyState";
import IEmpresa from "../../../types/IEmpresa";
import ISucursal from "../../../types/ISucursal";
import { useNavigate } from 'react-router-dom';

const EmpresaComponent: React.FC = () => {
    const url = import.meta.env.VITE_API_URL;
    const dispatch = useAppDispatch();
    const empresaService = new EmpresaService();
    const globalEmpresas = useAppSelector((state) => state.empresa.data);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [empresaEditar, setEmpresaEditar] = useState<Empresa | undefined>();
    const [, setEmpresaSucursales] = useState<ISucursal[]>();
    const navigate = useNavigate();

    const fetchSucursalesForEmpresa = async (empresaId: number) => {
        try {
            const empresa = await empresaService.get(url + `/empresa/sucursales`, empresaId);
            setEmpresaSucursales(empresa.sucursales);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
            return [];
        }
    };






    const fetchEmpresas = async () => {
        try {
            setIsLoading(true);
            const empresas = await empresaService.getAll(url + "/empresa");
            dispatch(setEmpresa(empresas));
            setIsLoading(false);
        } catch (error) {
            console.error("Error al obtener las empresas:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
            fetchEmpresas();
    }, [dispatch]);


    const handleEdit = (empresa: Empresa) => {
        setIsEditing(true);
        setEmpresaEditar(empresa); // Aquí asegúrate que empresa no sea undefined
        dispatch(toggleModal({ modalName: "modal" }));
    };

    const handleAddEmpresa = () => {
        setIsEditing(false);
        setEmpresaEditar(undefined);
        dispatch(toggleModal({ modalName: "modal" }));
    };

    const handleAddSucursal = (empresa: Empresa) => {
        dispatch(toggleModal({ modalName: "modalSucursal" }));
        setEmpresaEditar(empresa);
    };

    const generateInitialSucursal = (idEmpresa: number): SucursalPost => {
        return {
            nombre: "",
            horarioApertura: "",
            horarioCierre: "",
            domicilio: {
                calle: "",
                numero: 0,
                cp: 0,
                piso: 0,
                nroDpto: 0,
                idLocalidad: 0,
            },
            idEmpresa: idEmpresa,
            esCasaMatriz: false,
        };
    };

    return (
        <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
            <Container sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Typography variant="h5" gutterBottom>
                    Empresas
                </Typography>
                <AddButton onClick={handleAddEmpresa} />
                {!isLoading && globalEmpresas.length === 0 ? (
                    <EmptyState
                        title="No hay empresas disponibles"
                        description="Parece que aún no has creado ninguna empresa. ¿Por qué no crear una ahora?"
                    />
                ) : (
                    <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
                        {globalEmpresas.map((empresa: IEmpresa) => (
                            <GenericCard
                                images={empresa.imagenes}
                                key={empresa.id}
                                title={empresa.nombre}
                                subtitle={empresa.razonSocial}
                                actions={[
                                    {
                                        icon: <EditIcon />,
                                        tooltip: "Editar",
                                        onClick: () => handleEdit(empresa)
                                    },
                                ]}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    CUIL: {empresa.cuil}
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, gap: 1 }}>
                                    <Button
                                        startIcon={<AddCircle sx={{ color: '#fb6376' }} />}
                                        onClick={() => handleAddSucursal(empresa)}
                                        variant="outlined"
                                        sx={{ color: '#fb6376', borderColor: '#fb6376', fontSize: '0.70rem', padding: '8px 14px' }}
                                    >
                                        Sucursales
                                    </Button>
                                    <Button
                                        startIcon={<Visibility />}
                                        onClick={() => {
                                            fetchSucursalesForEmpresa(empresa.id);
                                            navigate(`/empresa/${empresa.id}`);
                                        }}
                                        sx={{ color: '#ffffff', backgroundColor: '#fb6376', fontSize: '0.70rem', padding: '9px 15px', '&:hover': { backgroundColor: '#fa5064' } }}
                                    >
                                        Sucursales
                                    </Button>
                                </Box>
                            </GenericCard>
                        ))}
                    </Box>
                )}
                {isLoading && (
                    <Box sx={{ display: "flex", justifyContent: "center", minHeight: "100vh", marginY: 2 }}>
                        <CircularProgress sx={{ color: "#fb6376" }} />
                    </Box>
                )}
                <ModalEmpresa
                    modalName="modal"
                    initialValues={empresaEditar || { id: 0, eliminado: false, nombre: "", razonSocial: "", cuil: 0, sucursales: [], imagenes: [] }}
                    isEditMode={isEditing}
                    getEmpresas={fetchEmpresas}
                    empresaAEditar={empresaEditar} 
                    onClose={() => dispatch(toggleModal({ modalName: "modal" }))} 
                />
                <ModalSucursal
                    modalName="modalSucursal"
                    initialValues={empresaEditar ? generateInitialSucursal(empresaEditar.id) : generateInitialSucursal(0)}
                    isEditMode={false}
                    getSucursales={fetchEmpresas}
                    idEmpresa={empresaEditar?.id || 0}
                    casaMatrizDisabled={true}
                />
            </Container>
        </Box>
    );
};

export default EmpresaComponent;
