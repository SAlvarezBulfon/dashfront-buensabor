import React from 'react';
import { Typography, Box } from '@mui/material';

interface EmptyStateProps {
  title: string;
  description: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      height="100%"
    >
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>
      <Typography variant="body1" mb={4}>
        {description}
      </Typography>
    </Box>
  );
};

export default EmptyState;
