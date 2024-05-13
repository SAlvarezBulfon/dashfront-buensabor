import { ErrorMessage, Field } from "formik";
import "./textFieldValue.css"; // Importación del archivo de estilos CSS

interface Props {
  label: string; // Etiqueta del campo
  name: string; // Nombre del campo
  type: string; // Tipo de campo (text, number, etc.)
  placeholder: string; // Placeholder del campo
  disabled?: boolean; // Opcional: si el campo está deshabilitado
}

// Componente TextFieldValue
const TextFieldValue = ({ label, name, type, placeholder, disabled }: Props) => {
  // Componente para crear los input de un formulario con Formik
  return (
    <div className="mt-2" style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: ".3rem 0",
        }}
      >
        {/* Etiqueta del campo */}
        <label
          htmlFor={label}
          style={{
            color: "black",
            fontFamily: "sans-serif",
            fontSize: "14px",
            fontWeight: "bold",
          }}
        >
          {label}
        </label>
      </div>

      {/* Campo de entrada del formulario */}
      <Field
        className={`form-control mb-3 input-formulario `}
        placeholder={placeholder}
        name={name}
        type={type}
        autoComplete="off"
        disabled={disabled} // Aplicar la propiedad disabled si está definida
      />

      {/* Mensaje de error para el campo */}
      <ErrorMessage component="div" name={name} className="error" />
    </div>
  );
};

export default TextFieldValue; // Exportación del componente TextFieldValue
