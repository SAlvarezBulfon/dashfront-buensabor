import React, { useState, useEffect } from 'react';
import { Button, Container, Box, Typography, Alert, TextField } from '@mui/material';
import TableComponent from '../Table/Table';
import { IUnidadMedida } from '../../../../types/IUnidadMedida';
import UnidadMedidaService from '../../../../services/UnidadMedidaService';
import { onDelete } from '../../../../utils/utils';
import EmptyState from '../../Cards/EmptyState/EmptyState';
import swal from 'sweetalert2';
import Column from '../../../../types/Column';
import ModalUnidadMedida from '../../Modals/ModalUnidadDeMedida';
// xd
const TableUnidadMedida: React.FC = () => {
  const [units, setUnits] = useState<IUnidadMedida[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [errorMessage, ] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialData, setInitialData] = useState<IUnidadMedida | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const url = import.meta.env.VITE_API_URL;
  const unidadMedidaService = new UnidadMedidaService();

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

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditId(null);
    setInitialData(undefined);
  };

  const handleAddOrUpdate = async (unit: IUnidadMedida) => {
    try {
      if (editId !== null) {
        await unidadMedidaService.put(url + '/UnidadMedida', editId, unit);
        const updatedUnits = units.map((u) => (u.id === editId ? unit : u));
        setUnits(updatedUnits);
        swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La unidad de medida ha sido actualizada correctamente',
          confirmButtonColor: '#fb6376',
        });
      } else {
        unit.id = Date.now();
        await unidadMedidaService.post(url + '/UnidadMedida', unit);
        setUnits([...units, unit]);
        swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'La unidad de medida ha sido agregada correctamente',
          confirmButtonColor: '#fb6376',
        });
      }
      handleModalClose();
    } catch (error) {
      console.error('Error agregando/modificando unidad de medida:', error);
    }
  };

  const handleEdit = (unit: IUnidadMedida) => {
    setInitialData(unit);
    setEditId(unit.id);
    handleModalOpen();
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredUnits = units.filter(unit =>
    unit.denominacion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: Column[] = [
    { id: "denominacion", label: "Nombre", renderCell: (rowData) => <>{rowData.denominacion}</> },
  ];

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" sx={{ mt: 8, mb: 2 }}>
        Unidades de Medida
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleModalOpen}
          sx={{
            backgroundColor: '#fb6376',
            "&:hover": {
              bgcolor: "#d73754",
            },
          }}
        >
          + Unidad de Medida
        </Button>
      </Box>
      
      <TextField
        fullWidth
        label="Buscar por nombre"
        value={searchQuery}
        onChange={handleSearchChange}
        sx={{ mb: 2 }}
      />

      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      
      {filteredUnits.length === 0 ? (
        <Box sx={{ my: 5 }}>
          <EmptyState title="No hay unidades de medida" description="Agrega nuevas unidades de medida para comenzar" />
        </Box>
      ) : (
        <TableComponent
          data={filteredUnits}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
      
      <ModalUnidadMedida
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleAddOrUpdate}
        initialData={initialData}
      />
    </Container>
  );
};

export default TableUnidadMedida;
