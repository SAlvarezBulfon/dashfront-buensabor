import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TableComponent from '../Table/Table';
import { IUnidadMedida } from '../../../../types/IUnidadMedida';
import UnidadMedidaService from '../../../../services/UnidadMedidaService';
import { onDelete } from '../../../../utils/utils';
import * as Yup from 'yup';
import EmptyState from '../../Cards/EmptyState/EmptyState';
import swal from 'sweetalert2';
import Column from '../../../../types/Column';

const TableUnidadMedida: React.FC = () => {
  const navigate = useNavigate();
  const [units, setUnits] = useState<IUnidadMedida[]>([]);
  const [denominacion, setDenominacion] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const url = import.meta.env.VITE_API_URL;
  const unidadMedidaService = new UnidadMedidaService();

  const validationSchema = Yup.object().shape({
    denominacion: Yup.string()
      .required('La denominación es requerida')
      .test(
        'denominacionUnica',
        'Ya existe una unidad de medida con esta denominación',
        (value) =>
          !units.some(
            (unit) =>
              unit.denominacion.toLowerCase() === value?.toLowerCase() &&
              (editId === null || unit.id !== editId)
          )
      ),
  });

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    try {
      const response = await unidadMedidaService.getAll(url + '/UnidadMedida');
      setUnits(response);
    } catch (error) {
      console.error('Error obteniendo unidades de medida:', error);
    }
  };

  const handleAdd = async () => {
    try {
      await validationSchema.validate({ denominacion });
      setErrorMessage('');

      if (editId !== null) {
        const updatedUnit = { id: editId, denominacion, eliminado: false };
        await unidadMedidaService.put(url + '/UnidadMedida', editId, updatedUnit);
        const updatedUnits = units.map((unit) =>
          unit.id === editId ? { ...unit, denominacion } : unit
        );
        setUnits(updatedUnits);
        setEditId(null);
        swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La unidad de medida ha sido actualizada correctamente',
          confirmButtonColor: '#fb6376',
        });
      } else {
        const newUnit: IUnidadMedida = { id: Date.now(), denominacion, eliminado: false };
        await unidadMedidaService.post(url + '/UnidadMedida', newUnit);
        setUnits([...units, newUnit]);
        swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La unidad de medida ha sido agregada correctamente',
          confirmButtonColor: '#fb6376',
        });
      }
      setDenominacion('');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        setErrorMessage(error.errors[0]);
      } else {
        console.error('Error agregando/modificando unidad de medida:', error);
      }
    }
  };

  const handleEdit = (unit: IUnidadMedida) => {
    setDenominacion(unit.denominacion);
    setEditId(unit.id);
  };

  const handleDelete = async (unit: IUnidadMedida) => {
    try {
      await onDelete(
        unit,
        async (unitToDelete: IUnidadMedida) => {
          await unidadMedidaService.delete(url + '/UnidadMedida', unitToDelete.id);
        },
        fetchUnits,
        () => {},
        (error: any) => {
          console.error('Error al eliminar unidad:', error);
        }
      );
    } catch (error) {
      console.error('Error al eliminar unidad:', error);
    }
  };

  const columns: Column[] = [
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2, my: 10 }}>
        <Button
          sx={{
            bgcolor: '#fb6376',
            '&:hover': {
              bgcolor: '#d73754',
            },
          }}
          variant="contained"
          onClick={() => navigate('/insumos/:sucursalId')}
        >
          Volver a Insumos
        </Button>
      </Box>

      <Typography variant="h4" sx={{ my: 8 }}>
        Unidades de Medida
      </Typography>

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, my: 0 }}>
        <TextField
          sx={{ mr: 1 }}
          label="Denominación"
          value={denominacion}
          onChange={(e) => setDenominacion(e.target.value)}
        />
        <Button sx={{ color: '#fb6376' }} onClick={handleAdd}>{editId !== null ? 'Actualizar' : 'Agregar'}</Button>
      </Box>
      {units.length === 0 ? (
        <Box sx={{ my: 5 }}>
          <EmptyState title="No hay unidades de medida" description="Agrega nuevas unidades de medida para comenzar" />
        </Box>
      ) : (
        <TableComponent
          data={units}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
};

export default TableUnidadMedida;
