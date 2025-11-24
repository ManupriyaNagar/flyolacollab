"use client";

import { useState, useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

const VirtualizedSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchTerm) return options;
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

  const ItemRenderer = ({ index, style }) => {
    const option = filteredOptions[index];
    return (
      <div
        style={style}
        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          onChange(option.value);
          setIsOpen(false);
          setSearchTerm('');
        }}
      >
        {option.label}
      </div>
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? options.find(opt => opt.value === value)?.label : placeholder}
      </button>
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-200"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <List
            height={Math.min(200, filteredOptions.length * 40)}
            itemCount={filteredOptions.length}
            itemSize={40}
          >
            {ItemRenderer}
          </List>
        </div>
      )}
    </div>
  );
};

export default VirtualizedSelect;