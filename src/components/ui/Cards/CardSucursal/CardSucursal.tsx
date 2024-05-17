import React from 'react';
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material';
import { CheckCircleOutline, HighlightOff, Edit, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Sucursal from '../../../../types/ISucursal';

interface CardSucursalProps {
  sucursal: any;
  onEdit: (sucursal: Sucursal) => void;
  onDelete: (sucursal: Sucursal) => void;
}

const CardSucursal: React.FC<CardSucursalProps> = ({ sucursal, onEdit, onDelete }) => {
  
  return (
    <Card sx={{ maxWidth: 400, margin: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div" sx={{ color: '#fb6376', fontWeight: 'bold' }}>
          {sucursal.nombre}
        </Typography>
        <Divider sx={{ my: 1 }} />
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Horario:</strong> {sucursal.horarioApertura} - {sucursal.horarioCierre}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <strong>Dirección:</strong> {sucursal.domicilio.calle} {sucursal.domicilio.numero}, {sucursal.domicilio.localidad.provincia.nombre}, {sucursal.domicilio.localidad.provincia.pais.nombre} 
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Casa Matriz:</strong> {sucursal.esCasaMatriz ? <CheckCircleOutline sx={{ color: '#4caf50' }} /> : <HighlightOff sx={{ color: '#f44336' }} />}
        </Typography>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <Button
          onClick={() => onEdit(sucursal)}
          variant="contained"
          sx={{ bgcolor: '#fb6376', '&:hover': { bgcolor: '#d73754' }, mr: 1 }}
          startIcon={<Edit />}
        >
          Editar
        </Button>
        <Button
          onClick={() => onDelete(sucursal)}
          variant="contained"
          sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' }, mr: 1}}
          startIcon={<Delete />}
        >
          Eliminar
        </Button>
        <Button
          component={Link}
          to={`/dashboard/${sucursal.id}`} // Asegúrate de que esta ruta sea correcta
          variant="contained"
          sx={{ bgcolor: '#4caf50', '&:hover': { bgcolor: '#388e3c' }}}
        >
          Dashboard
        </Button>
      </Box>
    </Card>
  );
};

export default CardSucursal;
