import React from 'react';
import { Modal, Button, Typography } from '@mui/material';
import { Formik, Form, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store'; 
import { toggleModal } from '../../../redux/slices/ModalReducer';
import Swal from 'sweetalert2'; 

interface ModalProps {
  modalName: string;
  title: string;
  initialValues: any;
  validationSchema: Yup.ObjectSchema<any>;
  onSubmit: (values: any) => void;
  children?: React.ReactNode;
  isEditMode: boolean;
}

const GenericModal: React.FC<ModalProps> = ({ modalName, title, initialValues, validationSchema, onSubmit, children, isEditMode }) => {
  const dispatch = useDispatch();
  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  const handleClose = () => {
    dispatch(toggleModal({ modalName }));
  };

  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values);
      handleClose();
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: isEditMode ? 'Cambios guardados exitosamente' : 'Datos añadidos exitosamente',
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al enviar los datos. Por favor, inténtalo de nuevo.',
      });
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <Modal 
      open={showModal} 
      onClose={handleClose} 
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div 
        style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          width: '90%', 
          height: '80%', 
          borderRadius: '8px',
          overflow: 'auto'
        }}
      >
        <Typography variant="h5">{title}</Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps: FormikProps<any>) => (
            <Form onSubmit={formikProps.handleSubmit}>
              {children}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Button variant="outlined" onClick={handleClose} style={{ marginRight: '10px', color: '#e91e63', borderColor: '#e91e63' }}>
                  Cerrar
                </Button>
                <Button variant="contained" color="primary" type="submit" style={{ backgroundColor: '#e91e63', color: '#fff' }}>
                  {isEditMode ? 'Guardar Cambios' : 'Añadir'} 
                  
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Modal>
  );
};

export default GenericModal;
