import React, { ChangeEvent } from 'react';

interface SelectListProps {
  title: string;
  items: string[];
  handleChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  selectedValue: string;
}

const SelectList: React.FC<SelectListProps> = ({ title, items, handleChange, selectedValue }) => {
  return (
    <div>
      <label>{title}</label>
      <select onChange={handleChange} value={selectedValue}>
        {items.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectList;
