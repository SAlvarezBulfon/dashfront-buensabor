import { useEffect, useState } from "react";
import { Box, Typography, Button, Container, CircularProgress } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import Column from '../../../types/Column';
import Sucursal from '../../../types/ISucursal';
import EmpresaService from '../../../services/EmpresaService';
import { toggleModal } from '../../../redux/slices/ModalReducer';
import { handleSearch, onDelete } from '../../../utils/utils';
import SearchBar from '../../ui/common/SearchBar/SearchBar';
import TableComponent from '../../ui/Table/Table';
import { setSucursal } from '../../../redux/slices/SucursalReducer';
import ModalSucursal from '../../ui/Modals/ModalSucursal';
import SucursalService from '../../../services/SucursalService';
import IEmpresa from "../../../types/IEmpresa";
import SucursalPost from "../../../types/post/SucursalPost";
import ISucursal from "../../../types/ISucursal";
import { CheckCircleOutline, HighlightOff } from '@mui/icons-material';
import EmptyState from "../../ui/Cards/EmptyState/EmptyState";




const SucursalesEmpresa = () => {
  // Obtener el ID de la empresa de los parámetros de la URL
  const { empresaId } = useParams<{ empresaId: string }>();

  // Estado para almacenar el nombre de la empresa
  const [nombreEmpresa, setNombreEmpresa] = useState<string>('');

  //Estado para almacenar la empresa 
  const [empresa, setEmpresa] = useState<IEmpresa>();

  // Dispatch de Redux para actualizar el estado global
  const dispatch = useAppDispatch();

  // Instancia del servicio de la empresa 
  const empresaService = new EmpresaService();
  // Instancia del servicio de la sucursal
  const sucursalService = new SucursalService();
  //URL de la API
  const url = import.meta.env.VITE_API_URL;

  // Selector de Redux para obtener las sucursales
  const sucursalesEmpresa = useAppSelector((state) => state.sucursal.data);

  // Estado para almacenar las sucursales filtradas
  // Estado para almacenar las sucursales filtradas
  const [filteredData, setFilteredData] = useState<(ISucursal | SucursalPost)[]>([]);


  // Estado para controlar si se está editando una sucursal
  const [isEditing, setIsEditing] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  // Estado para almacenar la sucursal que se está editando
  const [sucursalEditar, setSucursalEditar] = useState<Sucursal | SucursalPost>();

  const [casaMatrizDisabled, setCasaMatrizDisabled] = useState<boolean>(false); // Nuevo estado para deshabilitar el checkbox de casa matriz

  // Función para obtener las sucursales de la API
  const fetchSucursal = async () => {
    try {
      setIsLoading(true)
      if (empresaId !== undefined) { // Verificar que empresaId no sea undefined
        const empresa = await empresaService.get(`${url}/empresa/sucursales`, parseInt(empresaId));
        // Actualizar el estado global de Redux con las sucursales
        dispatch(setSucursal(empresa.sucursales));
        // Actualizar las sucursales filtradas
        setFilteredData(empresa.sucursales);
        setIsLoading(false)
      } else {
        console.error("Error: empresaId es undefined");
      }
    } catch (error) {
      console.error("Error al obtener las sucursales:", error);
    }
  };


  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        if (empresaId !== undefined) {
          const idEmpresa: number = parseInt(empresaId);
          const empresa = await empresaService.get(`${url}/empresa/sucursales`, idEmpresa);
          dispatch(setSucursal(empresa.sucursales));
          setFilteredData(empresa.sucursales);
          setNombreEmpresa(empresa.nombre);
          setEmpresa(empresa);

          // Verificar si alguna sucursal está marcada como casa matriz y deshabilitar el checkbox si es necesario
          const hasCasaMatriz = await empresa.sucursales.some((sucursal: ISucursal) => sucursal.esCasaMatriz);
          setCasaMatrizDisabled(hasCasaMatriz);
        }
      } catch (error) {
        console.error('Error al obtener la empresa:', error);
      }
    };

    fetchSucursal();
    fetchEmpresa();
  }, [empresaId, url, dispatch]);

  // Función para manejar la búsqueda de sucursales
  const onSearch = (query: string) => {
    // Filtrar las sucursales según el nombre
    handleSearch(query, sucursalesEmpresa, 'nombre', setFilteredData);
  };

  // Función para manejar la eliminación de una sucursal
  const onDeleteSucursal = async (sucursal: Sucursal) => {
    try {
      await onDelete(
        sucursal,
        async (sucursalToDelete: Sucursal) => {
          await sucursalService.delete(url + '/sucursal', sucursalToDelete.id);
        },
        fetchSucursal,
        () => {
          window.location.reload(); // Recargar la página después de eliminar la sucursal
        },
        (error: any) => {
          console.error("Error al eliminar sucursal:", error);
        }
      );
    } catch (error) {
      console.error("Error al eliminar sucursal:", error);
    }
  };

  // Función para manejar la edición de una sucursal
  const handleEdit = (sucursal: Sucursal) => {
    setIsEditing(true);
    setSucursalEditar(sucursal);
    dispatch(toggleModal({ modalName: "modal" }));
  };

  const handleAddSucursal = () => {
    setIsEditing(false);
    setSucursalEditar(undefined); // Limpiar la sucursal a editar al agregar una nueva
    dispatch(toggleModal({ modalName: "modal" }));
  };
  // Definir las columnas de la tabla de sucursales
  const columns: Column[] = [
    { id: 'nombre', label: 'Nombre', renderCell: (sucursal) => <>{sucursal.nombre}</> },
    { id: 'horarioApertura', label: 'Horario de Apertura', renderCell: (sucursal) => <>{sucursal.horarioApertura}</> },
    { id: 'horarioCierre', label: 'Horario de Cierre', renderCell: (sucursal) => <>{sucursal.horarioCierre}</> },
    {
      id: 'direccion',
      label: 'Dirección',
      renderCell: (sucursal) => (
        <div>
          {/* Concatenar los campos de la dirección */}
          <p>{sucursal.domicilio.calle}, {sucursal.domicilio.numero}</p>
          <p>{sucursal.domicilio.localidad.nombre}, {sucursal.domicilio.localidad.provincia.nombre}, {sucursal.domicilio.localidad.provincia.pais.nombre}</p>
        </div>
      ),
    },
    {
      id: 'casaMatriz',
      label: 'Casa Matriz',
      renderCell: (sucursal) => (
        <div className={sucursal.esCasaMatriz ? 'casa-matriz' : ''}>
          {sucursal.esCasaMatriz ? <CheckCircleOutline color="primary" /> : <HighlightOff color="error" />}
        </div>
      ),
    },
  ];


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
        {!isLoading && filteredData.length > 0 && (
          <Box>
            <Box sx={{ mt: 2 }}>
              <SearchBar onSearch={onSearch} />
            </Box>
            <TableComponent data={filteredData} columns={columns} onDelete={onDeleteSucursal} onEdit={handleEdit} />
          </Box>
        )}

<Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
        }}>
            {isLoading && <CircularProgress sx={{ color: '#fb6376' }} />}
        {!isLoading && filteredData.length === 0 &&
          <EmptyState
            title="No hay sucursales disponibles"
            description={`Parece que aún no has creado ninguna sucursal en ${empresa?.nombre} . ¿Por qué no crear una ahora?`}
          />
        }
        </Box>
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
