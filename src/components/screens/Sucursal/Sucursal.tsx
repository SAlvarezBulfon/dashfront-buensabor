import { useEffect, useState } from "react";
import { Box, Typography, Button, Container } from '@mui/material';
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
  const [filteredData, setFilteredData] = useState<Sucursal[]>([]);

  // Estado para controlar si se está editando una sucursal
  const [isEditing, setIsEditing] = useState(false);

  // Estado para almacenar la sucursal que se está editando
  const [sucursalEditar, setSucursalEditar] = useState<Sucursal>();


  // Función para obtener las sucursales de la API
  const fetchSucursal = async () => {
    try {
      const sucursales = await sucursalService.getAll(`${url}/sucursal`);
      // Actualizar el estado global de Redux con las sucursales
      dispatch(setSucursal(sucursales));
      // Actualizar las sucursales filtradas
      setFilteredData(sucursales);
    } catch (error) {
      console.error("Error al obtener las sucursales:", error);
    }
  };

  // Efecto para cargar la empresa y las sucursales al montar el componente
  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        if (empresaId !== undefined) {
          // Convertir empresaId a tipo number usando parseInt
          const idEmpresa: number = parseInt(empresaId);

          // Obtener la empresa utilizando empresaId
          const empresa = await empresaService.get(`${url}/empresa/empresa/sucursales`, idEmpresa);
          // Actualizar el estado global de Redux con las sucursales
          dispatch(setSucursal(empresa.sucursales));
          // Actualizar las sucursales filtradas
          setFilteredData(empresa.sucursales);

          setNombreEmpresa(empresa.nombre);

          setEmpresa(empresa)
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
          sucursalService.delete(url + '/sucursal', sucursalToDelete.id);
        },
        fetchSucursal,
        () => {
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
    // Establecer isEditing a true y almacenar la sucursal a editar
    setIsEditing(true);
    setSucursalEditar(sucursal)
    // Abrir el modal de edición
    dispatch(toggleModal({ modalName: "modal" }));
  };

  // Función para manejar la adición de una nueva sucursal
  const handleAddSucursal = () => {
    // Restablecer isEditing a false
    setIsEditing(false);
    // Abrir el modal de edición
    dispatch(toggleModal({ modalName: "modal" }));
  };

  // Definir las columnas de la tabla de sucursales
  const columns: Column[] = [
    { id: 'nombre', label: 'Nombre', renderCell: (sucursal) => <>{sucursal.nombre}</> },
    { id: 'calle', label: 'Calle', renderCell: (sucursal) => <>{sucursal.domicilio.calle}</> },
    { id: 'numero', label: 'Número', renderCell: (sucursal) => <>{sucursal.domicilio.numero}</> },
    { id: 'localidad', label: 'Localidad', renderCell: (sucursal) => <>{sucursal.domicilio.localidad.nombre}</> },
    { id: 'provincia', label: 'Provincia', renderCell: (sucursal) => <>{sucursal.domicilio.localidad.provincia.nombre}</> },
    { id: 'pais', label: 'País', renderCell: (sucursal) => <>{sucursal.domicilio.localidad.provincia.pais.nombre}</> },
  ];

  const generateInitialSucursal = (empresa: IEmpresa): Sucursal => {
    return {
      id: 0,
      eliminado: false,
      nombre: '',
      horarioApertura: '',
      horarioCierre: '',
      domicilio: {
        id: 0,
        eliminado: false,
        calle: '',
        numero: 0,
        cp: 0,
        piso: 0,
        nroDpto: 0,
        localidad: {
          id: 0,
          eliminado: false,
          nombre: '',
          provincia: {
            id: 0,
            eliminado: false,
            nombre: '',
            pais: {
              id: 0,
              eliminado: false,
              nombre: ''
            }
          }
        }
      },
      empresa: empresa
    };
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, my: 10 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", my: 1 }}>
          <Typography variant="h5" gutterBottom>
            Sucursales de {nombreEmpresa}
          </Typography>
          {/* Botón para agregar una nueva sucursal */}
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
          {/* Barra de búsqueda */}
          <SearchBar onSearch={onSearch} />
        </Box>
        {/* Tabla de sucursales */}
        <TableComponent data={filteredData} columns={columns} onDelete={onDeleteSucursal} onEdit={handleEdit} />
        {/* Modal para editar/agregar sucursal */}
        <ModalSucursal
          modalName="modal"
          initialValues={sucursalEditar || generateInitialSucursal(empresa || {} as IEmpresa)}
          isEditMode={isEditing}
          getSucursales={fetchSucursal}
          empresa={empresa || {} as IEmpresa}
        />

      </Container>
    </Box>
  );
};

export default SucursalesEmpresa;
