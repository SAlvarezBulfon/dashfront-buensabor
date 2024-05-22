import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Grid, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Column from '../../../../types/Column';

interface Props {
  data: any[];
  columns: Column[];
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

const TableComponent: React.FC<Props> = ({ data, columns, onEdit, onDelete }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Grid container spacing={3}>
        {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
          <Grid item xs={12} md={6} lg={4} key={index}>
            <Card>
              <CardContent>
                {columns.map((column) => (
                  <Typography key={column.id} variant="body2" color="textSecondary" component="p">
                    <strong>{column.label}</strong> {column.renderCell ? column.renderCell(item) : item[column.id]}
                  </Typography>
                ))}
                {(onEdit || onDelete) && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    {onEdit && (
                      <IconButton onClick={() => onEdit(item)} size="small">
                        <EditIcon sx={{ color: '#2196f3' }} /> {/* Color celeste */}
                      </IconButton>
                    )}
                    {onDelete && (
                      <IconButton onClick={() => onDelete(item)} size="small">
                        <DeleteIcon color="error" />
                      </IconButton>
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableComponent;
