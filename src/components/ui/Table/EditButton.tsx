import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

interface EditButtonProps {
  onClick: () => void;
}

const EditButton: React.FC<EditButtonProps> = ({ onClick }) => {
  return (
    <Tooltip title="Editar">
      <IconButton aria-label="editar" onClick={onClick}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};

export default EditButton;