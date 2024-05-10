import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';

interface Props {
  // Función que se llama cuando se realiza una búsqueda.
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<Props> = ({ onSearch }) => {
  // Estado local para almacenar la consulta de búsqueda.
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Función para manejar el cambio en la consulta de búsqueda.
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  // Función para limpiar la consulta de búsqueda.
  const handleClearSearch = () => {
    setSearchQuery('');
    // Llama a la función de búsqueda proporcionada por el padre con una cadena vacía.
    onSearch('');
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Buscar..."
      value={searchQuery}
      onChange={handleSearchChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {searchQuery && (
              // Botón para borrar la consulta de búsqueda.
              <IconButton onClick={handleClearSearch} edge="end">
                <CloseIcon />
              </IconButton>
            )}
            {/* Botón para activar la búsqueda. */}
            <IconButton edge="end">
              <SearchIcon />
            </IconButton>
          </InputAdornment>
        )
      }}
    />
  );
};

export default SearchBar;
