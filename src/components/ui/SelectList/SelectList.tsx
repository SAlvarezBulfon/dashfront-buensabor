import React from 'react';
import './select.css'

interface SelectListProps {
    title: string;
    items: string[];
    handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectList: React.FC<SelectListProps> = ({ title, items, handleChange }) => {

    return (
        <div className="select-list-container">
            <label htmlFor={`${title}-select`} className="select-label"><b>{title}</b></label>
            <select
                id={`${title}-select`}
                className="select-list"
                onChange={handleChange}
            >
                <option value="" disabled selected>Seleccione una opción</option>
                {items.map((item, index) => (
                    <option key={index} value={item}>{item}</option>
                ))}
            </select>
        </div>
    );
};

export default SelectList;
