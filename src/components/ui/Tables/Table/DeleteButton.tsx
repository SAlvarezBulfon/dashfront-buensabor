import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (

    <Tooltip title="Eliminar">
    <IconButton aria-label="eliminar" onClick={onClick}>
      <DeleteIcon />
    </IconButton>
   </Tooltip>
  );
};

export default DeleteButton;