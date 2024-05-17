// NoResults.tsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const NoResults: React.FC = () => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        No se encontraron coincidencias
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Intenta con otro término de búsqueda.
      </Typography>
    </Box>
  );
};

export default NoResults;
