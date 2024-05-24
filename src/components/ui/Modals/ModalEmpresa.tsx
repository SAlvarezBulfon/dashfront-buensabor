import React, { useState } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import EmpresaService from '../../../services/EmpresaService';
import Swal from 'sweetalert2';
import IEmpresa from '../../../types/IEmpresa';
import EmpresaPost from '../../../types/post/EmpresaPost';
import '../../../utils/swal.css';

interface ModalEmpresaProps {
  modalName: string;
  initialValues: IEmpresa;
  isEditMode: boolean;
  getEmpresas: () => void;
  empresaAEditar?: IEmpresa;
}

const ModalEmpresa: React.FC<ModalEmpresaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getEmpresas,
  empresaAEditar,
}) => {
  const empresaService = new EmpresaService();
  const URL = import.meta.env.VITE_API_URL;
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo requerido'),
    razonSocial: Yup.string().required('Campo requerido'),
    cuil: Yup.string()
      .matches(/^[0-9]+$/, 'CUIL inválido. Solo se permiten números.')
      .matches(/^\d{11}$/, 'CUIL inválido. Debe tener 11 dígitos.')
      .required('Campo requerido'),
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const uploadImages = async (id: number) => {
    if (!selectedFiles) {
      return Swal.fire({
        title: "No hay imágenes seleccionadas",
        text: "Selecciona al menos una imagen",
        icon: "warning",
        customClass: {
          popup: 'my-swal',
        },
      });
    }

    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("uploads", file);
    });

    console.log("FormData:", formData); // Log para verificar los datos del FormData

    const url = `${URL}/empresa/uploads?id=${id}`;

    Swal.fire({
      title: "Subiendo imágenes...",
      text: "Espere mientras se suben los archivos.",
      customClass: {
        popup: 'my-swal',
      },
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        // Agregar clase personalizada al modal de SweetAlert
        const modal = Swal.getPopup();
        if (modal) {
          modal.classList.add('my-swal');
        }
      },
    });

    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir las imágenes');
      }

      Swal.fire("Éxito", "Imágenes subidas correctamente", "success");
    } catch (error) {
      Swal.fire("Error", "Algo falló al subir las imágenes, inténtalo de nuevo.", "error");
      console.error("Error al subir las imágenes:", error);
    }
    setSelectedFiles(null);
  };

  const handleSubmit = async (values: EmpresaPost) => {
    let rollback = false;
    let id: number | null = null;

    try {
      if (isEditMode && empresaAEditar) {
        await empresaService.put(`${URL}/empresa`, empresaAEditar.id, values);
        id = empresaAEditar.id;
      } else {
        const response = await empresaService.post(`${URL}/empresa`, values) as IEmpresa;
        id = response.id;
      }

      // Verifica si hay un ID válido antes de llamar a uploadImages
      if (id !== null) {
        if (selectedFiles) {
          await uploadImages(id);
        }

        if (rollback) {
          // Si se activa el rollback, eliminar la empresa creada
          await empresaService.delete(`${URL}/empresa`, id);
        } else {
          getEmpresas();
        }
      } else {
        // Si el ID es null, muestra un mensaje de error
        throw new Error('El ID de la empresa es nulo');
      }
    } catch (error) {
      rollback = true;
      if (id !== null) {
        await empresaService.delete(`${URL}/empresa`, id);
      }
      Swal.fire("Error", "Ocurrió un error, por favor intenta nuevamente.", "error");
      console.error('Error al enviar los datos:', error);
    }
  };

  if (!isEditMode) {
    initialValues = {
      id: 0,
      eliminado: false,
      nombre: '',
      razonSocial: '',
      cuil: 0,
      sucursales: [],
      imagenes: [],
    };
  }

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Empresa' : 'Añadir Empresa'}
      initialValues={empresaAEditar || initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
    >
      <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre" />
      <TextFieldValue label="Razón Social" name="razonSocial" type="text" placeholder="Razón Social" />
      <TextFieldValue label="CUIL" name="cuil" type="text" placeholder="Ejemplo: 12345678901" />
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        multiple
      />
    </GenericModal>
  );
};

export default ModalEmpresa;
