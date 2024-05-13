import React, { useState, useEffect, ChangeEvent } from 'react';
import * as Yup from 'yup';
import GenericModal from '../../ui/Modals/GenericModal';
import TextFieldValue from '../../ui/TextFieldValue/TextFieldValue';
import SucursalService from '../../../services/SucursalService';
import Sucursal from '../../../types/ISucursal';
import PaisService from '../../../services/PaisService';
import ProvinciaService from '../../../services/ProvinciaService';
import LocalidadService from '../../../services/LocalidadService';
import SelectList from '../SelectList/SelectList';
import ILocalidad from '../../../types/ILocalidad'; 
import IProvincia from '../../../types/IProvincia';
import IPais from '../../../types/IPais';
import SucursalPost from '../../../types/post/SucursalPost';
import ISucursal from '../../../types/ISucursal';

interface ModalSucursalProps {
  modalName: string;
  initialValues: SucursalPost | ISucursal;
  isEditMode: boolean;
  getSucursales: Function;
  sucursalAEditar?: Sucursal;
  idEmpresa: number,
}

const ModalSucursal: React.FC<ModalSucursalProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getSucursales,
  sucursalAEditar,
  idEmpresa,
}) => {
  const sucursalService = new SucursalService();
  const URL: string = import.meta.env.VITE_API_URL as string;
  const paisService = new PaisService();
  const provinciaService = new ProvinciaService();
  const localidadService = new LocalidadService();

  const [paises, setPaises] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]); 

  const [selectedPais, setSelectedPais] = useState<string>('');
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>('');
  const [casaMatriz, setCasaMatriz] = useState<boolean>(false); // Estado para casa matriz
  const [provinciaNombre, setProvinciaNombre] = useState<string>('');
  const [localidadNombre, setLocalidadNombre] = useState<string>('');
  
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo requerido'),
    horarioCierre: Yup.string().required('Campo requerido'),
    horarioApertura: Yup.string().required('Campo requerido'),
    
  });

  useEffect(() => {
    const fetchPaises = async () => {
      try {
        const paises = await paisService.getAll(`${URL}/pais`);
        setPaises(paises);
      } catch (error) {
        console.error('Error al obtener los países:', error);
      }
    };

    fetchPaises();
  }, [URL]);

  useEffect(() => {
    const fetchProvincias = async () => {
      try {
        if (selectedPais) {
          const provincias = await provinciaService.getAll(`${URL}/provincia/findByPais/${selectedPais}`);
          setProvincias(provincias);
        }
      } catch (error) {
        console.error('Error al obtener las provincias:', error);
      }
    };

    fetchProvincias();
  }, [URL, selectedPais]);

  useEffect(() => {
    const fetchLocalidades = async () => {
      try {
        if (selectedProvincia) {
          const localidades = await localidadService.getAll(`${URL}/localidad/findByProvincia/${selectedProvincia}`);
          setLocalidades(localidades);
        }
      } catch (error) {
        console.error('Error al obtener las localidades:', error);
      }
    };

    fetchLocalidades();
  }, [URL, selectedProvincia]);

  const handlePaisChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const paisNombre = event.target.value;
    const paisSeleccionado = paises.find((pais) => pais.nombre === paisNombre);
    if (paisSeleccionado) {
      setSelectedPais(paisSeleccionado.id);
      setSelectedProvincia('');
      setSelectedLocalidad('');
    }
  };

 // Función para manejar el cambio de provincia
const handleProvinciaChange = (event: ChangeEvent<HTMLSelectElement>) => {
  const provNombre = event.target.value;
  const provSeleccionada = provincias.find((provincia) => provincia.nombre === provNombre);
  if (provSeleccionada) {
    setSelectedProvincia(provSeleccionada.id);
    setSelectedLocalidad('');
    setProvinciaNombre(provSeleccionada.nombre); // Actualizar el nombre de la provincia seleccionada
  }
};

// Función para manejar el cambio de localidad
const handleLocalidadChange = (event: ChangeEvent<HTMLSelectElement>) => {
  const localidadNombre = event.target.value; 
  // Buscar la localidad por su nombre en el array de localidades
  const localidadSeleccionada = localidades.find(localidad => localidad.nombre === localidadNombre);
  if (localidadSeleccionada) {
    // Asignar el ID de la localidad seleccionada
    setSelectedLocalidad(localidadSeleccionada.id.toString());
    setLocalidadNombre(localidadSeleccionada.nombre); // Actualizar el nombre de la localidad seleccionada
  }
};
// Función para manejar el cambio del checkbox de Casa Matriz
const handleCasaMatrizChange = (event: ChangeEvent<HTMLInputElement>) => {
  setCasaMatriz(event.target.checked);
};

  if (!isEditMode) {
    initialValues = {
      nombre: '',
      horarioApertura: '',
      horarioCierre: '',
      domicilio: {
        calle: '',
        numero: 0,
        cp: 0,
        piso: 0,
        nroDpto: 0,
        idLocalidad: 0
      },
      idEmpresa: idEmpresa,
      esCasaMatriz: false, // Agregar casa matriz con valor predeterminado
    };
  }

  const handleSubmit = async (values: SucursalPost | Sucursal) => {
    try {
      // Crear el objeto de domicilio
      const domicilio = {
        calle: values.domicilio.calle,
        numero: values.domicilio.numero,
        cp: values.domicilio.cp,
        piso: values.domicilio.piso,
        nroDpto: values.domicilio.nroDpto,
        idLocalidad: parseInt(selectedLocalidad), // Convertir a número entero
      };
  
      let sucursalData: SucursalPost | Sucursal;
  
      if (isEditMode) {
        // Si estamos en modo de edición, es un objeto Sucursal, así que eliminamos el id del objeto
        const { id, ...rest } = values as Sucursal;
        sucursalData = {
          ...rest,
          domicilio: domicilio,
          esCasaMatriz: casaMatriz,
          idEmpresa: idEmpresa,
        };
        console.log('Data a enviar en modo edición:', sucursalData);
        await sucursalService.put(`${URL}/sucursal`, id, sucursalData);
      } else {
        // Si no estamos en modo de edición, es un objeto SucursalPost y agregamos el id de la empresa
        sucursalData = {
          ...values,
          domicilio: domicilio,
          esCasaMatriz: casaMatriz,
          idEmpresa: idEmpresa,
        };
        console.log('Data a enviar en modo creación:', sucursalData);
        await sucursalService.post(`${URL}/sucursal`, sucursalData);
      }
  
      getSucursales();
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };
  
  

  
  

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Sucursal' : 'Añadir Sucursal'}
      initialValues={sucursalAEditar || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre" />
      <TextFieldValue label="Horario de Apertura" name="horarioApertura" type="time" placeholder="Horario de apertura" />
      <TextFieldValue label="Horario de Cierre" name="horarioCierre" type="time" placeholder="Horario de cierre" />
      <TextFieldValue label="Calle" name="domicilio.calle" type="text" placeholder="Calle" />
      <TextFieldValue label="Número" name="domicilio.numero" type="number" placeholder="Número" />
      <TextFieldValue label="Código Postal" name="domicilio.cp" type="number" placeholder="Código Postal" />
      <TextFieldValue label="Piso" name="domicilio.piso" type="number" placeholder="Piso" />
      <TextFieldValue label="Número de Departamento" name="domicilio.nroDpto" type="number" placeholder="Número de Departamento" />
      <SelectList
        title="Países"
        items={paises.map((pais: IPais) => pais.nombre)}
        handleChange={handlePaisChange}
        selectedValue={selectedPais}
      />
      {selectedPais && (
        <SelectList
          title="Provincias"
          items={provincias.map((provincia: IProvincia) => provincia.nombre)}
          handleChange={handleProvinciaChange}
          //selectedValue={selectedProvincia}
          selectedValue={provinciaNombre}
        />
      )}
      {selectedProvincia && (
        <SelectList
          title="Localidades"
          items={localidades.map((localidad: ILocalidad) => localidad.nombre)}
          handleChange={handleLocalidadChange}
          //selectedValue={selectedLocalidad}
          selectedValue={localidadNombre}
        />
      )}
      {/* Checkbox para indicar si es la casa matriz */}
      <label>
        <input
          type="checkbox"
          checked={casaMatriz}
          onChange={handleCasaMatrizChange}
        />
  
        Casa Matriz
      </label>
    </GenericModal>
  );
};

export default ModalSucursal;
