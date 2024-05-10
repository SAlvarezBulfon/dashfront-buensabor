import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store/store'; 
import { toggleModal } from '../../../redux/slices/ModalReducer';
import Swal from 'sweetalert2'; 

// Definición de las props del componente
interface ModalProps {
  modalName: string; // Nombre del modal
  title: string; // Título del modal
  initialValues: any; // Valores iniciales del formulario
  validationSchema: Yup.ObjectSchema<any>; // Esquema de validación con Yup
  onSubmit: (values: any) => void; // Función a ejecutar cuando se envíe el formulario
  children?: React.ReactNode; // Componentes hijos opcionales
  isEditMode: boolean; // Indicador de si el formulario está en modo de edición
}

const GenericModal: React.FC<ModalProps> = ({ modalName, title, initialValues, validationSchema, onSubmit, children, isEditMode }) => {
  const dispatch = useDispatch();
  const showModal = useSelector((state: RootState) => state.modal[modalName]);

  // Función para cerrar el modal
  const handleClose = () => {
    dispatch(toggleModal({ modalName }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (values: any) => {
    try {
      await onSubmit(values); // Ejecuta la función onSubmit con los valores del formulario
      handleClose(); // Cierra el modal después de enviar el formulario
      // Muestra una alerta de éxito usando SweetAlert
      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: isEditMode ? 'Cambios guardados exitosamente' : 'Datos añadidos exitosamente',
      });
    } catch (error) {
      // Muestra una alerta de error usando SweetAlert en caso de error en el envío del formulario
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al enviar los datos. Por favor, inténtalo de nuevo.',
      });
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <Modal show={showModal} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Formik para manejar el formulario */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {(formikProps: FormikProps<any>) => (
            // Form de react bootstrap
            <Form onSubmit={formikProps.handleSubmit}>
              {children} {/* Renderiza los componentes hijos */}
              <Modal.Footer>
                {/* Botón para cerrar el modal */}
                <Button variant="outline-secondary" onClick={handleClose}>
                  Cerrar
                </Button>
                {/* Botón para enviar el formulario */}
                <Button variant="outline-success" type="submit">
                  {isEditMode ? "Guardar Cambios" : "Añadir"}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

export default GenericModal;
