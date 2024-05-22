import React from 'react';
import { ErrorMessage, Field } from 'formik';
import { TextField, InputLabel } from '@mui/material'; 
import './textFieldValue.css'; // Importa el archivo de estilos CSS

interface TextFieldValueProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  disabled?: boolean
}

const TextFieldValue: React.FC<TextFieldValueProps> = ({ label, name, type, placeholder, disabled }) => {
  return (
    <div className="text-field-container">
      {/* Utiliza InputLabel de Material-UI */}
      <InputLabel htmlFor={name} className="label">
        {label}
      </InputLabel>
      {/* Renderiza un TextField o un TextArea según el tipo especificado */}
      {type === 'textarea' ? (
        <Field
          as={TextField} // Utiliza TextField como el componente para el campo Field
          variant="outlined" // Añade un borde alrededor del campo
          fullWidth // Ocupa todo el ancho disponible
          multiline // Permite múltiples líneas
          minRows={3} // Especifica el número mínimo de filas
          placeholder={placeholder}
          name={name}
          autoComplete="off"
          disabled={disabled}
        />
      ) : (
        <Field
          as={TextField} // Utiliza TextField como el componente para el campo Field
          variant="outlined" // Añade un borde alrededor del campo
          fullWidth // Ocupa todo el ancho disponible
          placeholder={placeholder}
          name={name}
          type={type}
          autoComplete="off"
          disabled={disabled}
        />
      )}
      <ErrorMessage component="div" name={name} className="error" />
    </div>
  );
};

export default TextFieldValue;
