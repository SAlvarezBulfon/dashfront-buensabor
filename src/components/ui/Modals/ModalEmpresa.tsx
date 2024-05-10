import React from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal'; 
import TextFieldValue from '../TextFieldValue/TextFieldValue'; 
import EmpresaService from '../../../services/EmpresaService'; 
import Empresa from '../../../types/IEmpresa'; 

// Define las props del componente de modal de empresa
interface ModalEmpresaProps {
  modalName: string; // Nombre del modal
  initialValues: Empresa; // Valores iniciales del formulario
  isEditMode: boolean; // Indicador de modo de edición
  getEmpresas: Function; // Función para obtener empresas
  empresaAEditar?: Empresa; // Empresa a editar
}

// Componente de modal de empresa
const ModalEmpresa: React.FC<ModalEmpresaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getEmpresas,
  empresaAEditar,
}) => {

  const empresaService = new EmpresaService(); // Instancia del servicio de empresa
  const URL = import.meta.env.VITE_API_URL; // URL de la API

  // Esquema de validación con Yup
  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo requerido'), // Campo nombre requerido
    razonSocial: Yup.string().required('Campo requerido'), // Campo razón social requerido
    cuil: Yup.string()
      .matches(/^[0-9]+$/, 'CUIL inválido. Solo se permiten números.') // CUIL solo números
      .matches(/^\d{11}$/, 'CUIL inválido. Debe tener 11 dígitos.') // CUIL debe tener 11 dígitos
      .required('Campo requerido'), // Campo CUIL requerido
  });



  // Función para manejar el envío del formulario
  const handleSubmit = async (values: Empresa) => {
    try {
      if (isEditMode) {
        await empresaService.put(`${URL}/empresa`, values.id, values); // Actualiza la empresa si está en modo de edición
      } else {
        await empresaService.post(`${URL}/empresa`, values); // Agrega una nueva empresa si no está en modo de edición
      }
      getEmpresas(); // Actualiza la lista de empresas
    } catch (error) {
      console.error('Error al enviar los datos:', error); // Manejo de errores
    }
  };

  // Si no está en modo de edición, se limpian los valores iniciales
  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado:false,
      nombre: '',
      razonSocial: '',
      cuil: 0,
      sucursales: [],
    };
  }

  // Renderiza el componente de modal genérico
  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Empresa' : 'Añadir Empresa'}
      initialValues={empresaAEditar || initialValues} // Usa la empresa a editar si está disponible, de lo contrario, usa los valores iniciales
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      {/* Campos del formulario */}
      <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre" />
      <TextFieldValue label="Razón Social" name="razonSocial" type="text" placeholder="Razón Social" />
      <TextFieldValue label="CUIL" name="cuil" type="number" placeholder="Ejemplo: 12345678901" />
    </GenericModal>
  );
};

export default ModalEmpresa; // Exporta el componente ModalEmpresa
