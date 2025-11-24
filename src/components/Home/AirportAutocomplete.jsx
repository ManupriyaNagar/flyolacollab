"use client";

import { useState, useRef, useEffect } from "react";
import { FaPlane, FaHelicopter, FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";

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

  // Get selected airport details
  const selectedAirport = airports.find(
    (a) => (a.airport_code || a.helipad_code) === value
  );

  // Filter airports based on search
  const filteredAirports = airports.filter((airport) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (airport.airport_name || airport.helipad_name || "").toLowerCase();
    const city = (airport.city || "").toLowerCase();
    const code = (airport.airport_code || airport.helipad_code || "").toLowerCase();
    
    return (
      name.includes(searchLower) ||
      city.includes(searchLower) ||
      code.includes(searchLower)
    );
  });

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
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

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleContainerClick = (e) => {
    if (!disabled) {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(true);
      setSearchTerm("");
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  };

  return (
    <div className="relative flex-1 " ref={containerRef}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700  flex items-center gap-2">
          {Icon && <Icon className="text-indigo-500" />}
          {label}
        </label>
      )}

      {/* Input Field */}
      <div className="relative">
        <div
          className={`flex flex-col justify-center w-full   transition-all duration-200 bg-white cursor-pointer h-14 ${
            isOpen
              ? ""
              : ""
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={handleContainerClick}
        >
          {!isOpen && selectedAirport ? (
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-3xl font-bold text-gray-900">
                  {selectedAirport.city.toUpperCase()}
                </div>
                <div className="text-sm text-gray-500 truncate">
                  {selectedAirport.airport_code || selectedAirport.helipad_code}, {selectedAirport.airport_name || selectedAirport.helipad_name}
                </div>
              </div>
              
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FaSearch className="text-gray-400 text-sm flex-shrink-0" />
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
                  className="flex-1 outline-none bg-transparent text-gray-900 placeholder-gray-400"
                  autoFocus
                />
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </div>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={dropdownRef}
            className="absolute  w-full mt-2 bg-white border-2 border-indigo-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto"
          >
            {filteredAirports.length > 0 ? (
              <div className="py-2">
                {filteredAirports.map((airport, index) => {
                  const code = airport.airport_code || airport.helipad_code;
                  const name = airport.airport_name || airport.helipad_name;
                  const isHighlighted = index === highlightedIndex;
                  const isSelected = value === code;

                  return (
                    <button
                      key={`${airport.id}-${code}`}
                      type="button"
                      onClick={() => handleSelect(airport)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`w-full px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                        isHighlighted
                          ? "bg-indigo-50"
                          : isSelected
                          ? "bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">
                            {airport.city}
                          </span>
                          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {code}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 truncate">
                          {name}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 flex-shrink-0">
                        {airport.airport_code && (
                          <FaPlane
                            className="text-blue-500 text-xs"
                            title="Airport"
                          />
                        )}
                        {airport.has_helipad && (
                          <FaHelicopter
                            className="text-red-500 text-xs"
                            title="Helipad"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <FaSearch className="mx-auto text-3xl mb-2 text-gray-300" />
                <p className="text-sm">No airports found</p>
                <p className="text-xs text-gray-400 mt-1">
                  Try a different search term
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
