import { useState, useEffect } from "react";
import { Box, Typography, Button, Container, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import TableComponent from "../Table/Table";
import { IInsumo } from "../../../../types/IInsumo";
import Row from "../../../../types/Row";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import InsumoService from "../../../../services/InsumoService";
import { setInsumo } from "../../../../redux/slices/InsumosReducer";
import { handleSearch, onDelete } from "../../../../utils/utils";
import Column from "../../../../types/Column";
import SearchBar from "../../common/SearchBar/SearchBar";
import ModalInsumo from "../../Modals/ModalInsumo";
import { toggleModal } from "../../../../redux/slices/ModalReducer";
import { InsumoPost } from "../../../../types/post/InsumoPost";
import EmptyState from "../../Cards/EmptyState/EmptyState";

const TableInsumo = () => {
    const navigate = useNavigate(); // Crear navigate para manejar la navegación
    const dispatch = useAppDispatch();
    const globalArticulosInsumos = useAppSelector((state) => state.insumo.data);
    const isModalOpen = useAppSelector((state) => state.modal.modalInsumo);
    const url = import.meta.env.VITE_API_URL;
    const insumoService = new InsumoService();
    const [filteredData, setFilteredData] = useState<Row[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<IInsumo | InsumoPost>();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchArticulosInsumos = async () => {
        try {
            const articulosInsumos = await insumoService.getAll(url + '/ArticuloInsumo');
            dispatch(setInsumo(articulosInsumos));
            setFilteredData(articulosInsumos);
        } catch (error) {
            console.error("Error al obtener los artículos de insumo:", error);
        } finally {
            setIsLoading(false); // Indicamos que la carga de datos ha terminado
        }
    };

    useEffect(() => {
        fetchArticulosInsumos();
    }, [dispatch]);

    const initialValue: InsumoPost = {
        denominacion: "",
        precioVenta: 0,
        idUnidadMedida: 0,
        precioCompra: 0,
        stockActual: 0,
        stockMaximo: 0,
        stockMinimo: 0,
        esParaElaborar: false,
        imagenes: [],
        idCategoria: 0
    };

    const onSearch = (query: string) => {
        handleSearch(query, globalArticulosInsumos, 'denominacion', setFilteredData);
    };

    const handleEdit = (insumo: IInsumo) => {
        if (insumo) {
            setIsEditing(true);
            setSelectedArticle(insumo);
            dispatch(toggleModal({ modalName: "modalInsumo" }));
        }
    };
    const handleAddInsumo = () => {
        setIsEditing(false);
        setSelectedArticle(initialValue);
        dispatch(toggleModal({ modalName: "modalInsumo" }));
    };

    const handleDelete = async (insumo: IInsumo) => {
        try {
            await onDelete(
                insumo,
                async (insumoToDelete: IInsumo) => {
                    await insumoService.delete(url + '/ArticuloInsumo', insumoToDelete.id);
                },
                fetchArticulosInsumos,
                () => { },
                (error: any) => {
                    console.error("Error al eliminar el insumo:", error);
                }
            );
        } catch (error) {
            console.error("Error al eliminar el insumo:", error);
        }
    };

    const columns: Column[] = [
        { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
        { id: "precioCompra", label: "Precio de compra", renderCell: (rowData) => <>{rowData.precioCompra}</> },
        { id: "precioVenta", label: "Precio de Venta", renderCell: (rowData) => <>{rowData.precioVenta}</> },
        { id: "stock", label: "Stock", renderCell: (rowData) => <>{rowData.stockActual}</> },
        { id: "unidadMedida", label: "Unidad De Medida", renderCell: (rowData) => <>{rowData.unidadMedida.denominacion}</> },
        {
            id: "elaboracion",
            label: "¿Es para elaborar?",
            renderCell: (rowData) => <>{rowData.esParaElaborar ? "Sí" : "No"}</>,
        },
    ];

    return (
        <Box component="main" sx={{ flexGrow: 1, my: 2 }}>
            <Container>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        Insumos
                    </Typography>
                    <Box>
                        <Button
                            sx={{
                                bgcolor: "#fb6376",
                                "&:hover": {
                                    bgcolor: "#d73754",
                                },
                                mr: 1,
                            }}
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleAddInsumo}
                        >
                            Insumo
                        </Button>
                        <Button
                            sx={{
                                bgcolor: "#fb6376",
                                "&:hover": {
                                    bgcolor: "#d73754",
                                },
                            }}
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => navigate("/unidad-de-medida")}
                        >
                            Unidad de medida
                        </Button>
                    </Box>
                </Box>
                {isLoading ? ( // Mostrar componente de carga mientras los datos se están cargando
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                        <CircularProgress sx={{ color: '#fb6376' }} />
                    </Box>
                ) : filteredData.length === 0 ? ( // Mostrar componente de estado vacío si no hay datos
                    <EmptyState
                        title="No hay insumos cargados"
                        description="Agrega nuevos insumos utilizando el formulario."
                    />
                ) : (
                    <>
                        <Box sx={{ mt: 2 }}>
                            <SearchBar onSearch={onSearch} />
                        </Box>
                        <TableComponent data={filteredData} columns={columns} onDelete={handleDelete} onEdit={handleEdit} />
                    </>
                )}
            </Container>
            {isModalOpen && selectedArticle &&
                <ModalInsumo
                    modalName="modalInsumo"
                    initialValues={selectedArticle || initialValue}
                    isEditMode={isEditing}
                    getInsumos={fetchArticulosInsumos}
                    insumoAEditar={selectedArticle}
                />
            }
        </Box>
    );
};

export default TableInsumo;
