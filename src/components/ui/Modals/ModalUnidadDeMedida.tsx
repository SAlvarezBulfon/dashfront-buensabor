
import React from 'react';
import { Box, Button, Modal, TextField, Typography } from '@mui/material';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { IUnidadMedida } from '../../../types/IUnidadMedida';

interface ModalUnidadMedidaProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (unidad: IUnidadMedida) => void;
  initialData?: IUnidadMedida;
}

const validationSchema = Yup.object().shape({
  denominacion: Yup.string().required('La denominación es requerida'),
});

const ModalUnidadMedida: React.FC<ModalUnidadMedidaProps> = ({ open, onClose, onSubmit, initialData }) => {
  const formik = useFormik({
    initialValues: initialData || { id: 0, denominacion: '', eliminado: false },
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
    enableReinitialize: true, 
  });

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          {initialData ? 'Editar Unidad de Medida' : 'Agregar Unidad de Medida'}
        </Typography>
        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            id="denominacion"
            name="denominacion"
            label="Denominación"
            value={formik.values.denominacion}
            onChange={formik.handleChange}
            error={formik.touched.denominacion && Boolean(formik.errors.denominacion)}
          />
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            sx={{ mt: 2, backgroundColor: '#fb6376', "&:hover": { bgcolor: "#d73754" } }}
          >
            {initialData ? 'Actualizar' : 'Agregar'}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default ModalUnidadMedida;
