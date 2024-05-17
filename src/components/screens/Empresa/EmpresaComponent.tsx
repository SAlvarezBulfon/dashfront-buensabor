import { Box, Typography, Button, Container, CircularProgress } from "@mui/material";
import { AddCircle, Visibility } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setEmpresa } from "../../../redux/slices/EmpresaReducer";

import EmpresaService from "../../../services/EmpresaService";
import Empresa from "../../../types/IEmpresa";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import { onDelete } from "../../../utils/utils";
import ModalEmpresa from "../../ui/Modals/ModalEmpresa";
import ModalSucursal from "../../ui/Modals/ModalSucursal";
import GenericCard from "../../ui/Cards/GenericCard/GenericCard";
import { useEffect, useState } from "react";
import SucursalPost from "../../../types/post/SucursalPost";
import AddButton from "../../ui/Buttons/AddButton";
import EmptyState from "../../ui/Cards/EmptyState/EmptyState";
import IEmpresa from "../../../types/IEmpresa";
import IImagen from "../../../types/IImagen";
import ISucursal from "../../../types/ISucursal";

const EmpresaComponent: React.FC = () => {
    const url = import.meta.env.VITE_API_URL;
    const dispatch = useAppDispatch();
    const empresaService = new EmpresaService();
    const globalEmpresas = useAppSelector((state) => state.empresa.data);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [empresaEditar, setEmpresaEditar] = useState<Empresa | undefined>();
    const [, setEmpresaSucursales] = useState<ISucursal[]>();
    const fetchSucursalesForEmpresa = async (empresaId: number) => {
        try {
            const empresa = await empresaService.get(url + `/empresa/sucursales`, empresaId);
            setEmpresaSucursales(empresa.sucursales);
        } catch (error) {
            console.error("Error al obtener las sucursales:", error);
            return [];
        }
    };
    const imagenes: IImagen[] = [
        {
            id: 1,
            eliminado: false,
            url: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=1335&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 2,
            eliminado: false,
            url: "https://images.unsplash.com/photo-1528732263440-4dd1a18a4cc2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            id: 3,
            eliminado: false,
            url: "https://images.unsplash.com/photo-1634250420331-68d96d14ec5b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c3RhcmJ1Y2tzfGVufDB8MHwwfHx8MA%3D%3D"
        }
    ];


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

    const onDeleteEmpresa = async (empresa: Empresa) => {
        try {
            await onDelete(
                empresa,
                async (empresaToDelete: Empresa) => {
                    await empresaService.delete(url + '/empresa', empresaToDelete.id);
                },
                fetchEmpresas,
                () => {
                },
                (error: any) => {
                    console.error("Error al eliminar empresa:", error);
                }
            );
        } catch (error) {
            console.error("Error al eliminar empresa:", error);
        }
    };

    const handleEdit = (empresa: Empresa) => {
        setIsEditing(true);
        setEmpresaEditar(empresa);
        dispatch(toggleModal({ modalName: "modal" }));
    };

    const handleAddEmpresa = () => {
        setIsEditing(false);
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
                                images={imagenes}
                                key={empresa.id}
                                title={empresa.nombre}
                                subtitle={empresa.razonSocial}
                                actions={[
                                    {
                                        icon: <Visibility />,
                                        tooltip: "Ver Sucursales",
                                        link: `/empresa/${empresa.id}`,
                                        onClick: () => fetchSucursalesForEmpresa(empresa.id)
                                    },
                                    {
                                        icon: <AddCircle />,
                                        tooltip: "Agregar Sucursal",
                                        onClick: () => handleAddSucursal(empresa)
                                    },
                                ]}
                            >

                                <Typography variant="body2" color="text.secondary">
                                    CUIL: {empresa.cuil}
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Button sx={{ mr: 1}} onClick={() => handleEdit(empresa)} variant="outlined" color="error" >
                                        Editar
                                    </Button>
                                    <Button onClick={() => onDeleteEmpresa(empresa)} variant="contained" color="error">
                                        Eliminar
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
                    initialValues={empresaEditar || { id: 0, eliminado: false, nombre: "", razonSocial: "", cuil: 0, sucursales: [] }}
                    isEditMode={isEditing}
                    getEmpresas={fetchEmpresas}
                />
                <ModalSucursal
                    modalName="modalSucursal"
                    initialValues={empresaEditar ? generateInitialSucursal(empresaEditar.id) : generateInitialSucursal(0)}
                    isEditMode={false}
                    getSucursales={fetchEmpresas}
                    idEmpresa={empresaEditar?.id || 0}
                    casaMatrizDisabled={false}
                />
            </Container>
        </Box>
    );
};

export default EmpresaComponent;
