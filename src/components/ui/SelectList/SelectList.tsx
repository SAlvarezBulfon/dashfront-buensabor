import React, { useEffect, useState } from 'react';
import './select.css'

interface SelectListProps {
    title: string;
    items: string[];
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedValue: string;
}

const SelectList: React.FC<SelectListProps> = ({ title, items, handleChange, selectedValue }) => {
    const [currentSelectedValue, setCurrentSelectedValue] = useState(selectedValue);

    useEffect(() => {
        // Verificar si el valor seleccionado actual sigue siendo válido en la nueva lista de items
        if (!items.includes(currentSelectedValue)) {
            // Si no, seleccionar el primer elemento de la lista
            setCurrentSelectedValue(items[0] || '');
        }
    }, [items]);

    useEffect(() => {
        // Actualizar el valor seleccionado actual cuando cambie selectedValue
        setCurrentSelectedValue(selectedValue);
    }, [selectedValue]);

    return (
        <div className="select-list-container">
            <label htmlFor={`${title}-select`} className="select-label"><b>{title}</b></label>
            <select
                id={`${title}-select`}
                className="select-list"
                onChange={handleChange}
                value={currentSelectedValue}
            >
                <option value="" disabled>Seleccione una opción</option>
                {items.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectList;
