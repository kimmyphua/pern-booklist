import classNames from 'classnames';
import React, { ReactNode, useEffect, useRef, useState } from 'react';

interface SelectProps {
  value: string[];
  onChange: (values: string[]) => void;
  options: { value: string; label: string }[];
  defaultOption?: { value: string; label: string };
  disabled?: boolean;
  prefix?: ReactNode;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  defaultOption,
  disabled = false,
  prefix,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOptions = options.filter((option) => value.includes(option.value));

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];

    onChange(newValue);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-full w-full relative" ref={wrapperRef}>
      {prefix && (
        <div className="flex">
          <span className="flex items-center px-2 py-2 text-base leading-tight text-gray-700 bg-white border border-r-0 border-gray-300 rounded-l-md w-max">
            {prefix}
          </span>
        </div>
      )}
      <div className="relative flex-1">
        <div
          className={classNames(
            'min-h-[38px] h-full w-full px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer flex items-center',
            {
              'border-l-0 rounded-l-none': prefix,
              'border-blue-500 ring-2 ring-blue-500': isOpen,
            }
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex flex-wrap gap-1">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center px-2 py-0.5 rounded text-sm bg-blue-100 text-blue-800"
                >
                  {option.label}
                  <button
                    type="button"
                    className="ml-1 text-blue-600 hover:text-blue-800"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(option.value);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))
            ) : (
              <span className="text-gray-400">Select...</span>
            )}
          </div>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200">
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border-0 focus:ring-0"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className={classNames('px-3 py-2 cursor-pointer hover:bg-gray-100', {
                  'bg-blue-50': value.includes(option.value),
                })}
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
