import React, { useState } from 'react';
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
import useAuthToken from '../../../hooks/useAuthToken';

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
  const getToken = useAuthToken();

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
      if (empresaImages.length + files.length > 3) {
        showModal("Error", "No puedes subir más de 3 imágenes", "warning");
        event.target.value = '';
        return;
      }
      setSelectedFiles(files);
      const totalImages = empresaImages.length + files.length;
      setDisableSubmit(totalImages === 0);
    }
  };

  const uploadImages = async (id: number) => {
    if (!selectedFiles) {
      return showModal("No hay imágenes seleccionadas", "Selecciona al menos una imagen", "warning");
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
      },
    });

    try {
      const token = await getToken();
      const response = await imagenService.uploadImages(url, formData, token);

      if (!response.ok) {
        throw new Error('Error al subir las imágenes');
      }

      showModal("Éxito", "Imágenes subidas correctamente", "success");
    } catch (error) {
      showModal("Imagen Cargada", "Imagen cargada", "success");
      console.error("Error al subir las imágenes:", error);
      onClose();
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
      const token = await getToken();
      const response = await fetch(`${URL}/empresa/deleteImg`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      Swal.close();

      if (response.ok) {
        showModal("Éxito", "Imagen eliminada correctamente", "success");
        const updatedImages = empresaImages.filter((img) => img.uuid !== uuid);
        setEmpresaImages(updatedImages);
        getEmpresas();
        onClose();
      } else {
          console.log("Error al borrar las imagenes");
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
      const token = await getToken();

      if (isEditMode && empresaAEditar) {
        await empresaService.putSec(`${URL}/empresa`, empresaAEditar.id, values, token);
        id = empresaAEditar.id;
      } else {
        const response = await empresaService.postSec(`${URL}/empresa`, values, token) as IEmpresa;
        id = response.id;
      }

      if (id !== null) {
        if (selectedFiles) {
          await uploadImages(id);
        }

        if (rollback) {
          await empresaService.deleteSec(`${URL}/empresa`, id, token);
        } else {
          getEmpresas();
        }
      } else {
        throw new Error('El ID de la empresa es nulo');
      }
    } catch (error) {
      rollback = true;
      if (id !== null) {
        const token = await getToken();
        await empresaService.deleteSec(`${URL}/empresa`, id, token);
      }
      showModal("Error", "Algo falló al crear la empresa, contacta al desarrollador.", "error");
      console.error("Error:", error);
    }

    setSelectedFiles(null);
    onClose();
  };

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
      <TextFieldValue label="CUIL" name="cuil" type="text" placeholder="Ejemplo: 12345678901"  disabled={isEditMode} />
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
      {isEditMode && empresaAEditar && empresaAEditar?.imagenes.length > 0 && (
        <div>
          <Typography variant='h5' sx={{ mb: 1 }}>Imágenes de la Empresa</Typography>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {empresaAEditar?.imagenes.map((image) => (
              <Card key={image.id} style={{ position: 'relative', width: '100px', height: '100px' }}>
                <CardMedia
                  component="img"
                  image={image.url}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <CardActions style={{ position: 'absolute', top: 0, right: 0 }}>
                  <IconButton style={{ color: 'red' }} onClick={() => handleDeleteImg(image.url, image.id.toString())}>
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
