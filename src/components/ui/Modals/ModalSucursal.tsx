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

import IEmpresa from '../../../types/IEmpresa';

interface ModalSucursalProps {
  modalName: string;
  initialValues: Sucursal;
  isEditMode: boolean;
  getSucursales: Function;
  sucursalAEditar?: Sucursal;
  empresa: IEmpresa,
}

const ModalSucursal: React.FC<ModalSucursalProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getSucursales,
  sucursalAEditar,
  empresa,
}) => {
  const sucursalService = new SucursalService();
  const URL: string = import.meta.env.VITE_API_URL as string;
  const paisService = new PaisService();
  const provinciaService = new ProvinciaService();
  const localidadService = new LocalidadService();

  const [paises, setPaises] = useState<any[]>([]);
  const [provincias, setProvincias] = useState<any[]>([]);
  const [localidades, setLocalidades] = useState<ILocalidad[]>([]); // Cambiamos el tipo de estado para localidades

  const [selectedPais, setSelectedPais] = useState<string>('');
  const [selectedProvincia, setSelectedProvincia] = useState<string>('');
  const [selectedLocalidad, setSelectedLocalidad] = useState<string>('');


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

  const handleProvinciaChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const provNombre = event.target.value;
    const provSeleccionada = provincias.find((provincia) => provincia.nombre === provNombre);
    if (provSeleccionada) {
      setSelectedProvincia(provSeleccionada.id);
      setSelectedLocalidad('');
    }
  };

  const handleLocalidadChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const localidadId = event.target.value; // Obtener el ID de la localidad
    setSelectedLocalidad(localidadId);
  };


if(!isEditMode){
    initialValues =  {
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
}

  const handleSubmit = async (values: Sucursal) => {
    try {
      // Por último, guardamos la sucursal
      if (isEditMode) {
        await sucursalService.put(`${URL}/sucursal`, values.id, values);
      } else {
        // Añadir la nueva sucursal
        await sucursalService.post(`${URL}/sucursal`, values);
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
        items={paises.map((pais: any) => pais.nombre)}
        handleChange={handlePaisChange}
        selectedValue={selectedPais} // Proporcionar el valor seleccionado
      />
      {selectedPais && (
        <SelectList
          title="Provincias"
          items={provincias.map((provincia: any) => provincia.nombre)}
          handleChange={handleProvinciaChange}
          selectedValue={selectedProvincia} // Proporcionar el valor seleccionado
        />
      )}
      {selectedProvincia && (
        <SelectList
          title="Localidades"
          items={localidades.map((localidad: ILocalidad) => localidad.nombre)}
          handleChange={handleLocalidadChange}
          selectedValue={selectedLocalidad} // Proporcionar el valor seleccionado
        />)}
        
    </GenericModal>
  );
};

export default ModalSucursal;
