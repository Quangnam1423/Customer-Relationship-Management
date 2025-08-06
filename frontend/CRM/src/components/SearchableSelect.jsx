import React, { useState, useRef, useEffect } from 'react';
import './SearchableSelect.css';

const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Chọn...", 
  searchPlaceholder = "Tìm kiếm...",
  getOptionLabel = (option) => option.label || option.name,
  getOptionValue = (option) => option.value || option.id,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    setFilteredOptions(options);
  }, [options]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = options.filter(option =>
        getOptionLabel(option).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (option.email && option.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [searchTerm, options, getOptionLabel]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(option => getOptionValue(option) === value);

  const handleSelect = (option) => {
    onChange(getOptionValue(option));
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className={`searchable-select ${className}`} ref={dropdownRef}>
      <div 
        className="select-input form-control"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 0);
          }
        }}
      >
        {selectedOption ? (
          <div className="selected-value">
            {getOptionLabel(selectedOption)}
            {selectedOption.email && (
              <small className="text-muted"> ({selectedOption.email})</small>
            )}
          </div>
        ) : (
          <div className="placeholder">{placeholder}</div>
        )}
        
        <div className="select-actions">
          {selectedOption && (
            <button
              type="button"
              className="btn-clear"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              ×
            </button>
          )}
          <span className="dropdown-arrow">▼</span>
        </div>
      </div>

      {isOpen && (
        <div className="select-dropdown">
          <div className="search-box">
            <input
              ref={inputRef}
              type="text"
              className="form-control"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <div className="options-list">
            {filteredOptions.length === 0 ? (
              <div className="no-options">Không tìm thấy kết quả</div>
            ) : (
              filteredOptions.map((option, index) => (
                <div
                  key={getOptionValue(option)}
                  className={`option ${getOptionValue(option) === value ? 'selected' : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  <div className="option-label">{getOptionLabel(option)}</div>
                  {option.email && (
                    <div className="option-email text-muted">{option.email}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
