'use client';

import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// TypeScript interfaces for Select props and options
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  options: SelectOption[];
  error?: boolean;
  errorMessage?: string;
  label?: string;
  description?: string;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  onChange?: (value: string | null) => void;
  onSearch?: (query: string) => void;
}

// Select component for dropdown selections with search capabilities
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    options,
    error = false,
    errorMessage,
    label,
    description,
    placeholder = 'Select an option...',
    searchable = false,
    clearable = false,
    disabled,
    required,
    value,
    onChange,
    onSearch,
    id,
    ...props
  }, ref) => {
    
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedValue, setSelectedValue] = useState<string | null>(value as string || null);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const optionsRef = useRef<HTMLDivElement>(null);

    // Generate unique ID for accessibility
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = description ? `${selectId}-description` : undefined;
    const errorId = errorMessage ? `${selectId}-error` : undefined;

    // Filter options based on search query
    const filteredOptions = searchable && searchQuery
      ? options.filter(option => 
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    // Find selected option
    const selectedOption = options.find(option => option.value === selectedValue);

    // Handle option selection
    const handleSelect = (optionValue: string) => {
      setSelectedValue(optionValue);
      setIsOpen(false);
      setSearchQuery('');
      setHighlightedIndex(-1);
      onChange?.(optionValue);
    };

    // Handle clear selection
    const handleClear = (event: React.MouseEvent) => {
      event.stopPropagation();
      setSelectedValue(null);
      setSearchQuery('');
      setHighlightedIndex(-1);
      onChange?.(null);
    };

    // Handle search input
    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
      const query = event.target.value;
      setSearchQuery(query);
      setHighlightedIndex(-1);
      onSearch?.(query);
    };

    // Handle keyboard navigation
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case 'Enter':
        case ' ':
          if (!isOpen) {
            setIsOpen(true);
            if (searchable) {
              searchInputRef.current?.focus();
            }
          } else if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleSelect(filteredOptions[highlightedIndex]!.value);
          }
          event.preventDefault();
          break;
        
        case 'Escape':
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
          break;
        
        case 'ArrowDown':
          if (!isOpen) {
            setIsOpen(true);
          } else {
            setHighlightedIndex(prev => 
              prev < filteredOptions.length - 1 ? prev + 1 : 0
            );
          }
          event.preventDefault();
          break;
        
        case 'ArrowUp':
          if (isOpen) {
            setHighlightedIndex(prev => 
              prev > 0 ? prev - 1 : filteredOptions.length - 1
            );
            event.preventDefault();
          }
          break;
      }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setSearchQuery('');
          setHighlightedIndex(-1);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Scroll highlighted option into view
    useEffect(() => {
      if (highlightedIndex >= 0 && optionsRef.current) {
        const highlightedElement = optionsRef.current.children[highlightedIndex] as HTMLElement;
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
          });
        }
      }
    }, [highlightedIndex]);

    // Base select classes
    const selectClasses = [
      // Base styles
      'flex h-10 w-full items-center justify-between rounded-md border border-input',
      'bg-background px-3 py-2 text-sm ring-offset-background',
      'placeholder:text-muted-foreground',
      'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'cursor-pointer',
      
      // Error state
      error && 'border-destructive focus:ring-destructive',
      
      // Custom className
      className,
    ];

    const ChevronIcon = () => (
      <svg
        className={cn('h-4 w-4 opacity-50 transition-transform', isOpen && 'rotate-180')}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    );

    const ClearIcon = () => (
      <svg
        className="h-4 w-4 opacity-50 hover:opacity-70"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m18 6-12 12" />
        <path d="m6 6 12 12" />
      </svg>
    );

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={selectId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              required && "after:content-['*'] after:ml-0.5 after:text-destructive"
            )}
          >
            {label}
          </label>
        )}
        
        {/* Select container */}
        <div ref={containerRef} className="relative">
          {/* Hidden native select for form submission */}
          <select
            ref={ref}
            id={selectId}
            value={selectedValue || ''}
            disabled={disabled}
            required={required}
            aria-invalid={error}
            aria-describedby={cn(descriptionId, errorId)}
            className="sr-only"
            tabIndex={-1}
            {...props}
          >
            <option value="">{placeholder}</option>
            {options.map(option => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom select trigger */}
          <div
            className={cn(...selectClasses)}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            tabIndex={disabled ? -1 : 0}
            role="combobox"
            aria-expanded={isOpen}
            aria-controls={`${selectId}-listbox`}
            aria-haspopup="listbox"
            aria-labelledby={label ? `${selectId}-label` : undefined}
          >
            <span className={cn('block truncate', !selectedOption && 'text-muted-foreground')}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            
            <div className="flex items-center space-x-1">
              {clearable && selectedValue && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center justify-center hover:bg-accent hover:text-accent-foreground rounded p-0.5"
                  aria-label="Clear selection"
                >
                  <ClearIcon />
                </button>
              )}
              <ChevronIcon />
            </div>
          </div>
          
          {/* Dropdown options */}
          {isOpen && (
            <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg">
              {/* Search input */}
              {searchable && (
                <div className="p-2 border-b border-border">
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search options..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full px-2 py-1 text-sm bg-background border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring"
                    autoFocus
                  />
                </div>
              )}
              
              {/* Options list */}
              <div
                ref={optionsRef}
                className="max-h-60 overflow-auto p-1"
                role="listbox"
                id={`${selectId}-listbox`}
                aria-labelledby={label ? `${selectId}-label` : undefined}
              >
                {filteredOptions.length === 0 ? (
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    No options found
                  </div>
                ) : (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={cn(
                        'relative cursor-pointer select-none py-1.5 px-2 text-sm rounded',
                        'hover:bg-accent hover:text-accent-foreground',
                        highlightedIndex === index && 'bg-accent text-accent-foreground',
                        selectedValue === option.value && 'bg-primary text-primary-foreground',
                        option.disabled && 'opacity-50 cursor-not-allowed'
                      )}
                      onClick={() => !option.disabled && handleSelect(option.value)}
                      role="option"
                      aria-selected={selectedValue === option.value}
                      aria-disabled={option.disabled}
                    >
                      {option.label}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Description */}
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {/* Error message */}
        {errorMessage && (
          <p id={errorId} className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };