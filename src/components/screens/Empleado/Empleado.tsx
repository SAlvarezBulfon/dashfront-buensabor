import { useState, useEffect } from 'react';
import { Box, Typography, Button, Container, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

import Row from '../../../types/Row';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import EmpleadoService from '../../../services/EmpleadoService';
import { setEmpleado } from '../../../redux/slices/EmpleadoReducer';
import { handleSearch, onDelete } from '../../../utils/utils';
import Column from '../../../types/Column';

import { toggleModal } from '../../../redux/slices/ModalReducer';
import IEmpleado from '../../../types/Empleado';
import EmpleadoPost from '../../../types/post/EmpleadoPost';
import SearchBar from '../../ui/common/SearchBar/SearchBar';
import EmptyState from '../../ui/Cards/EmptyState/EmptyState';
import TableComponent from '../../ui/Tables/Table/Table';
import ModalEmpleado from '../../ui/Modals/ModalEmpleado';
import useAuthToken from '../../../hooks/useAuthToken';

const Empleado = () => {
    const dispatch = useAppDispatch();
    const globalEmpleados = useAppSelector((state) => state.empleado.data);
    const isModalOpen = useAppSelector((state) => state.modal.modalEmpleado);
    const url = import.meta.env.VITE_API_URL;
    const empleadoService = new EmpleadoService();
    const [filteredData, setFilteredData] = useState<Row[]>([]);
    const [selectedEmpleado, setSelectedEmpleado] = useState<IEmpleado | EmpleadoPost>();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const getToken = useAuthToken();

    const { sucursalId } = useParams<{ sucursalId: string }>();

    const fetchEmpleados = async () => {
        try {
            const empleados = await empleadoService.getAll(`${url}/empleado/bySucursalId/${sucursalId}`);
            dispatch(setEmpleado(empleados));
            setFilteredData(empleados);
        } catch (error) {
            console.error("Error al obtener los empleados:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmpleados();
    }, [dispatch]);

    const initialValue: EmpleadoPost = {
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
        fechaNacimiento: "",
        rol: "",
        idSucursal: parseInt(sucursalId || '0'),
    };

    const onSearch = (query: string) => {
        handleSearch(query, globalEmpleados, 'nombre', setFilteredData);
    };

    const handleEdit = (empleado: IEmpleado) => {
        if (empleado) {
            setIsEditing(true);
            setSelectedEmpleado(empleado);
            dispatch(toggleModal({ modalName: "modalEmpleado" }));
        }
    };

    const handleAddEmpleado = () => {
        setIsEditing(false);
        setSelectedEmpleado(initialValue);
        dispatch(toggleModal({ modalName: "modalEmpleado" }));
    };

    const handleDelete = async (empleado: IEmpleado) => {
        try {
            const token = await getToken();
            await onDelete(
                empleado,
                async (empleadoToDelete: IEmpleado) => {
                    await empleadoService.deleteSec(`${url}/empleado`, empleadoToDelete.id, token);
                },
                fetchEmpleados,
                () => { },
                (error: any) => {
                    console.error("Error al eliminar el empleado:", error);
                }
            );
        } catch (error) {
            console.error("Error al eliminar el empleado:", error);
        }
    };

    const columns: Column[] = [
        { id: "nombre", label: "Nombre", renderCell: (rowData) => <>{rowData.nombre}</> },
        { id: "apellido", label: "Apellido", renderCell: (rowData) => <>{rowData.apellido}</> },
        { id: "telefono", label: "Teléfono", renderCell: (rowData) => <>{rowData.telefono}</> },
        { id: "email", label: "Email", renderCell: (rowData) => <>{rowData.email}</> },
        {
            id: "fechaNacimiento",
            label: "Fecha de Nacimiento",
            renderCell: (rowData) => <>{new Date(rowData.fechaNacimiento).toLocaleDateString('es-ES', { timeZone: 'UTC' })}</>
        },
        { id: "rol", label: "Rol", renderCell: (rowData) => <>{rowData.rol}</> },
    ];

    return (
        <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
            <Container>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Empleados
                    </Typography>
                    <Box>
                        <Button
                            sx={{
                                bgcolor: "#fb6376",
                                "&:hover": {
                                    bgcolor: "#d73754",
                                },
                                mr: 1,
                                padding: "10px 20px",
                                fontSize: "1.0rem"
                            }}
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAddEmpleado}
                        >
                            Empleado
                        </Button>
                    </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                    <SearchBar onSearch={onSearch} />
                </Box>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                        <CircularProgress sx={{ color: '#fb6376' }} />
                    </Box>
                ) : filteredData.length === 0 ? (
                    <Box sx={{ mt: 3 }}>
                        <EmptyState
                            title="No hay empleados cargados"
                            description="Agrega nuevos empleados utilizando el formulario."
                        />
                    </Box>
                ) : (
                    <TableComponent data={filteredData} columns={columns} onDelete={handleDelete} onEdit={handleEdit} />
                )}
            </Container>
            {isModalOpen && selectedEmpleado &&
                <ModalEmpleado
                    modalName="modalEmpleado"
                    initialValues={selectedEmpleado || initialValue}
                    isEditMode={isEditing}
                    getEmpleados={fetchEmpleados}
                    empleadoAEditar={selectedEmpleado}
                    idSucursal={parseInt(sucursalId || '0')}
                />
            }
        </Box>
    );
};

export default Empleado;
