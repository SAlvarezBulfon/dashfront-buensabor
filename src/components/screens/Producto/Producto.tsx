import { useEffect, useState } from "react";
import { Box, Typography, Button, Container, CircularProgress, CardMedia } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setProducto } from "../../../redux/slices/ProductoReducer";
import ProductoService from "../../../services/ProductoService";
import { handleSearch, onDelete } from "../../../utils/utils";
import Row from "../../../types/Row";
import Column from "../../../types/Column";
import ModalProducto from "../../ui/Modals/ModalProducto";
import IProducto from "../../../types/IProducto";
import { toggleModal } from "../../../redux/slices/ModalReducer";
import SearchBar from "../../ui/common/SearchBar/SearchBar";
import TableComponent from "../../ui/Tables/Table/TableComponent";
import useAuthToken from "../../../hooks/useAuthToken";
import { useParams } from "react-router-dom";

const Producto = () => {
  const getToken = useAuthToken();
  const url = import.meta.env.VITE_API_URL;
  const dispatch = useAppDispatch();
  const productoService = new ProductoService();
  const globalProductos = useAppSelector((state) => state.producto.data);
  const { sucursalId } = useParams<{ sucursalId: string }>();
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [productoEditar, setProductoEditar] = useState<IProducto>();
  const [isLoading, setIsLoading] = useState(true);
  const [rol,setRole] = useState<string>("");

  const fetchProductos = async () => {
    try {
      const productos = await productoService.getAll(url + "/ArticuloManufacturado");
      dispatch(setProducto(productos));
      setFilteredData(productos);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    } finally {
      setIsLoading(false); // Indicamos que la carga de datos ha terminado
    }
  };

  const onSearch = (query: string) => {
    handleSearch(query, globalProductos, "descripcion", setFilteredData);
  };

  useEffect(() => {
    fetchProductos();
  }, [dispatch]);

  useEffect(() => { // Mover la lógica para obtener el rol al useEffect
    const userDataString = localStorage.getItem('usuario');
    if (userDataString) {
        const userData = JSON.parse(userDataString);
        const rol = userData["https://my-app.example.com/roles"];
        console.log("rol",rol[0]);
        setRole(rol[0]);
    }
}, []);

  const onDeleteProducto = async (producto: IProducto) => {
    try {
      const token = await getToken();
      await onDelete(
        producto,
        async (productoToDelete: IProducto) => {
          await productoService.deleteSec(url + "/ArticuloManufacturado", productoToDelete.id, token);
        },
        fetchProductos,
        () => { },
        (error: any) => {
          console.error("Error al eliminar producto:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  const handleEdit = (producto: IProducto) => {
    setIsEditing(true);
    setProductoEditar(producto);
    dispatch(toggleModal({ modalName: "modalProducto" }));
  };

  const handleAddProducto = () => {
    setIsEditing(false);
    setProductoEditar(undefined);
    dispatch(toggleModal({ modalName: "modalProducto" }));
  };

  const columns: Column[] = [
    {
      id: "imagen",
      label: "",
      renderCell: (producto: IProducto | Row) => (
        <Box>
          {producto.imagenes && (
            <CardMedia
              component="img"
              height="140"
              image={producto.imagenes[0].url}
              alt="Producto"
              sx={{ borderRadius: '10px' }}
            />
          )}
        </Box>
      ),
    },
    {
      id: "denominacion",
      label: "",
      renderCell: (producto) => (
        <Typography variant="h6" fontWeight="bold">
          {producto.denominacion}
        </Typography>
      ),
    },
    { id: "descripcion", label: "", renderCell: (producto) => <>{producto.descripcion}</> },
    { id: "precioVenta", label: "$", renderCell: (producto) => <>{producto.precioVenta}</> },
    { id: "preparacion", label: "Preparación:", renderCell: (producto) => <>{producto.preparacion}</> },
    { id: "unidadMedida", label: "Unidad de Medida:", renderCell: (producto) => <>{producto.unidadMedida.denominacion}</> },
    {
      id: "tiempoEstimadoMinutos",
      label: "Tiempo estimado:",
      renderCell: (producto) => <>{producto.tiempoEstimadoMinutos} min</>,
    },
  ];

  return (
    <Box component="main" sx={{ height: "100%", overflow: "hidden", display: "flex", flexDirection: "column", mt: 8 }}>
      <Container sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 2 }}>
          <Typography variant="h4" gutterBottom>
            Productos
          </Typography>
          {["ADMIN", "COCINERO"].includes(rol) && (
          <Button
            onClick={handleAddProducto}
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: "#fb6376",
              "&:hover": {
                bgcolor: "#d73754",
              },
              padding: "10px 20px",
              fontSize: "1.0rem",
            }}
          >
            Producto
          </Button>)}
        </Box>
        <Box sx={{ mt: 2 }}>
          <SearchBar onSearch={onSearch} />
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <CircularProgress sx={{ color: '#fb6376' }} />
          </Box>
        ) : (

          <Box sx={{ flexGrow: 1, overflow: "auto", mt: 2 }}>
            <TableComponent data={filteredData} columns={columns} onDelete={onDeleteProducto} onEdit={handleEdit} />
          </Box>

        )}
        {sucursalId && (
          <ModalProducto
          idSucursal={parseInt(sucursalId)}
          modalName="modalProducto"
          initialValues={{
            id: 0,
            descripcion: "",
            tiempoEstimadoMinutos: 0,
            preparacion: "",
            precioVenta: 0,
            unidadMedida: 0,
            idsArticuloManufacturadoDetalles: [],
          }}
          isEditMode={isEditing}
          getProductos={fetchProductos}
          productoAEditar={productoEditar}
          onClose={() => dispatch(toggleModal({ modalName: "modalProducto" }))}

        />
        )}
      
      </Container>
    </Box>
  );
};

export default Producto;
