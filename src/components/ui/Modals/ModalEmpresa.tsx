import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import GenericModal from './GenericModal';
import TextFieldValue from '../TextFieldValue/TextFieldValue';
import EmpresaService from '../../../services/EmpresaService';
import IEmpresa from '../../../types/IEmpresa';
import EmpresaPost from '../../../types/post/EmpresaPost';
import '../../../utils/swal.css';
import { Delete, PhotoCamera } from '@mui/icons-material';
import { Button, Card, CardActions, CardMedia, IconButton, Typography } from '@mui/material';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import ImagenService from '../../../services/ImagenService';

interface ModalEmpresaProps {
  modalName: string;
  initialValues: IEmpresa;
  isEditMode: boolean;
  getEmpresas: () => void;
  empresaAEditar?: IEmpresa;
  onClose: () => void; 
}

const ModalEmpresa: React.FC<ModalEmpresaProps> = ({
  modalName,
  initialValues,
  isEditMode,
  getEmpresas,
  empresaAEditar,
  onClose,
}) => {
  const empresaService = new EmpresaService();
  const imagenService = new ImagenService();
  const URL = import.meta.env.VITE_API_URL;
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [empresaImages, setEmpresaImages] = useState<any[]>([]);
  const [disableSubmit, setDisableSubmit] = useState<boolean>(true);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required('Campo requerido'),
    razonSocial: Yup.string().required('Campo requerido'),
    cuil: Yup.string()
      .matches(/^[0-9]+$/, 'CUIL inválido. Solo se permiten números.')
      .matches(/^\d{11}$/, 'CUIL inválido. Debe tener 11 dígitos.')
      .required('Campo requerido'),
  });


  const showModal = (title: string , text: string, icon: SweetAlertIcon) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      customClass: {
        container: "my-swal",
      },
    });
  };
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // Verificar si la cantidad total de imágenes (las actuales más las nuevas) supera el límite de 3
      if (empresaImages.length + files.length > 3) {
        showModal("Error", "No puedes subir más de 3 imágenes", "warning");
        event.target.value = '';
        return;
      }
  
      // Si no supera el límite, actualizar la lista de archivos seleccionados
      setSelectedFiles(files);
      // Calcular la cantidad total de imágenes después de agregar las nuevas
      const totalImages = empresaImages.length + files.length;
      // Habilitar el botón de submit si hay al menos una imagen seleccionada
      setDisableSubmit(totalImages === 0);
    }
  };
  

  const uploadImages = async (id: number) => {
    if (!selectedFiles) {
      return showModal("No hay imágenes seleccionadas", "Selecciona al menos una imagen", "warning");;
    }
    const formData = new FormData();
    Array.from(selectedFiles).forEach((file) => {
      formData.append("uploads", file);
    });

    const url = `${URL}/empresa/uploads?id=${id}`;

    Swal.fire({
      title: "Subiendo imágenes...",
      text: "Espere mientras se suben los archivos.",
      customClass: {
        container: 'my-swal',
      },
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const modal = Swal.getPopup();
        if (modal) {
          modal.classList.add('my-swal');
        }
      },
    });

    try {
      const response = await imagenService.uploadImages(url, formData); 

      if (!response.ok) {
        throw new Error('Error al subir las imágenes');
      }

      showModal("Éxito", "Imágenes subidas correctamente", "success");
    } catch (error) {
      showModal("Error", "Algo falló al subir las imágenes, inténtalo de nuevo.", "error");
      console.error("Error al subir las imágenes:", error);
    }
    setSelectedFiles(null);
  };

  const handleDeleteImg = async (url: string, uuid: string) => {
    const urlParts = url.split("/");
    const publicId = urlParts[urlParts.length - 1];
  
    const formData = new FormData();
    formData.append("publicId", publicId);
    formData.append("id", uuid);
  
    if (empresaImages.length === 1) {
      showModal("Error", "No puedes eliminar la última imagen de la empresa", "warning");
      return;
    }
  
    Swal.fire({
      title: "Eliminando imagen...",
      text: "Espere mientras se elimina la imagen.",
      customClass: {
        container: 'my-swal',
      },
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  
    try {
      const response = await fetch(`${URL}/empresa/deleteImg`, {
        method: "POST",
        body: formData,
      });
  
      Swal.close();
  
      if (response.ok) {
        showModal("Éxito", "Imagen eliminada correctamente", "success");
        // Filtra la imagen eliminada de la lista
        const updatedImages = empresaImages.filter((img) => img.uuid !== uuid);
        setEmpresaImages(updatedImages);
        // Vuelve a cargar las imágenes actualizadas
        getEmpresas();
        onClose(); // Close the modal
      } else {
        showModal("Error", "Algo falló al eliminar la imagen, inténtalo de nuevo.", "error");
      }
    } catch (error) {
      Swal.close();
      showModal("Error", "Algo falló, contacta al desarrollador.", "error");
      console.error("Error:", error);
    }
  };
  



  const handleSubmit = async (values: EmpresaPost) => {
    if (!isEditMode && (!selectedFiles || selectedFiles.length === 0)) {
      Swal.fire({
        title: "Error",
        text: "Debes subir al menos una imagen",
        icon: "warning",
        customClass: {
          container: 'my-swal',
        },
      });
      return;
    }

    if (selectedFiles && selectedFiles.length > 3) {
      Swal.fire({
        title: "Error",
        text: "No puedes subir más de 3 imágenes",
        icon: "warning",
        customClass: {
          container: 'my-swal',
        },
      });
      return;
    }

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

      if (id !== null) {
        if (selectedFiles) {
          await uploadImages(id);
        }

        if (rollback) {
          await empresaService.delete(`${URL}/empresa`, id);
        } else {
          getEmpresas();
        }
      } else {
        throw new Error('El ID de la empresa es nulo');
      }
    } catch (error) {
      rollback = true;
      if (id !== null) {
        await empresaService.delete(`${URL}/empresa`, id);
      }
      showModal("Error", "Ocurrió un error, por favor intenta nuevamente.", "error");
      console.error('Error al enviar los datos:', error);
    }
  };

  useEffect(() => {
    if (isEditMode && empresaAEditar) {
      if (empresaAEditar.imagenes) {
        setEmpresaImages(empresaAEditar.imagenes);
      }
    }
  }, [isEditMode, empresaAEditar]);

  useEffect(() => {
    if (isEditMode) {
      setDisableSubmit(false);
    } else {
      setDisableSubmit(true);
    }
  }, [isEditMode]);

  useEffect(() => {
    return () => {
      setSelectedFiles(null);
    };
  }, []);



  const formInitialValues = isEditMode && empresaAEditar ? empresaAEditar : initialValues;

  return (
    <GenericModal
      modalName={modalName}
      title={isEditMode ? 'Editar Empresa' : 'Añadir Empresa'}
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      isEditMode={isEditMode}
      disableSubmit={disableSubmit}
    >
      <TextFieldValue label="Nombre" name="nombre" type="text" placeholder="Nombre" />
      <TextFieldValue label="Razón Social" name="razonSocial" type="text" placeholder="Razón Social" disabled={isEditMode} />
      <TextFieldValue label="CUIL" name="cuil" type="text" placeholder="Ejemplo: 12345678901" />
      <Button
        variant="contained"
        component="label"
        startIcon={<PhotoCamera />}
        sx={{
          my: 2,
          bgcolor: "#fb6376",
          "&:hover": {
            bgcolor: "#d73754",
          },
        }}
      >
        Subir Imágenes
        <input
          type="file"
          hidden
          onChange={handleFileChange}
          multiple
        />
      </Button>
      {isEditMode && empresaImages.length > 0 && (
        <div>
          <Typography variant='h5' sx={{ mb: 1 }}>Imágenes de la Empresa</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {empresaImages.map((image) => (
              <Card key={image.id} style={{ position: 'relative', width: '100px', height: '100px' }}>
                <CardMedia
                  component="img"
                  image={image.url}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <CardActions style={{ position: 'absolute', top: 0, right: 0 }}>
                  <IconButton style={{ color: 'red' }} onClick={() => handleDeleteImg(image.url, image.id)}>
                    <Delete />
                  </IconButton>
                </CardActions>
              </Card>
            ))}
          </div>
        </div>
      )}


    </GenericModal>
  );
};

export default ModalEmpresa;
