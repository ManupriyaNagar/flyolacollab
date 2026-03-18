"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function AirportAutocomplete({
  airports,
  value,
  onChange,
  placeholder,
  label,
  icon: Icon,
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const containerRef = useRef(null);

  // Find selected location - check helipad_code first, then airport_code
  const selectedAirport = airports.find(
    (a) => a.helipad_code === value || a.airport_code === value
  );

  const filteredAirports = airports.filter((airport) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (airport.airport_name || airport.helipad_name || "").toLowerCase();
    const city = (airport.city || "").toLowerCase();
    const code = (airport.airport_code || airport.helipad_code || "").toLowerCase();
    return name.includes(searchLower) || city.includes(searchLower) || code.includes(searchLower);
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredAirports.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredAirports[highlightedIndex]) {
          handleSelect(filteredAirports[highlightedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        break;
    }
  };

  const handleSelect = (airport) => {
    onChange(airport.airport_code || airport.helipad_code);
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleContainerClick = (e) => {
    if (!disabled) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
      setSearchTerm("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  return (
    <div className={cn('relative', 'flex-1')} ref={containerRef}>
      {label && (
        <label className={cn('block', 'text-sm', 'font-light', 'text-gray-400', 'ml-1', 'mb-2')}>
          {label}
        </label>
      )}

      <div className="relative">
        <div
          className={`flex flex-col justify-center w-full bg-transparent cursor-pointer min-h-[50px] ${disabled ? "opacity-30 cursor-not-allowed" : ""
            }`}
          onClick={handleContainerClick}
        >
          {!isOpen && selectedAirport ? (
            <div className={cn('flex', 'flex-row', 'justify-between')}>
              <div className={cn('text-lg', 'font-light', 'text-gray-900', 'tracking-tighter')}>
                {selectedAirport.city.toUpperCase()}
              </div>
              <div className={cn('text-[11px]', 'font-light', 'text-gray-400', 'truncate')}>
                {selectedAirport.airport_code || selectedAirport.helipad_code} · {selectedAirport.airport_name || selectedAirport.helipad_name}
              </div>
            </div>
          ) : (
            <div className={cn('flex', 'items-center', 'gap-3')}>
              <FaSearch className={cn('text-gray-400', 'text-lg', 'flex-shrink-0')} />
              {isOpen ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={disabled}
                  className={cn('w-full', 'outline-none', 'bg-transparent', 'text-gray-900', 'font-light', 'text-lg', 'placeholder-gray-400')}
                  autoFocus
                />
              ) : (
                <span className="text-gray-400 font-light text-lg">{placeholder}</span>
              )}
            </div>
          )}
        </div>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={cn(
              'absolute',
              'top-full',
              'left-0',
              'mt-3',
              'w-[350px]',
              'bg-white',
              'rounded-2xl',
              'shadow-[0_20px_60px_rgba(0,0,0,0.15)]',
              'z-[100]',
              'overflow-hidden',
              'border',
              'border-gray-100'
            )}
          >
            <div className="max-h-[300px] overflow-y-auto py-2 custom-scrollbar">
              {filteredAirports.length > 0 ? (
                filteredAirports.map((airport, index) => (
                  <div
                    key={airport.id || airport.airport_code || airport.helipad_code}
                    className={cn(
                      'px-5',
                      'py-4',
                      'cursor-pointer',
                      'transition-colors',
                      'flex',
                      'flex-col',
                      'gap-0.5',
                      highlightedIndex === index ? 'bg-blue-50' : 'hover:bg-gray-50'
                    )}
                    onClick={() => handleSelect(airport)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-gray-900 text-sm">
                        {airport.city}
                      </span>
                      <span className="text-blue-600 font-black tracking-tighter text-sm">
                        {airport.airport_code || airport.helipad_code}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-gray-400 truncate">
                      {airport.airport_name || airport.helipad_name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-6 py-8 text-center">
                  <p className="text-gray-500 font-bold">No results found for "{searchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
