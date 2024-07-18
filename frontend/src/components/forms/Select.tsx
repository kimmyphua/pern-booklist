import React from 'react'

interface SelectProps {
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  defaultOption?: { value: string; label: string }
  disabled?: boolean
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  defaultOption,
  disabled = false
}) => {
  return (
    <div className="relative inline-block w-full">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
        {defaultOption != null && (
          <option value={defaultOption.value}>{defaultOption.label}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path fillRule="evenodd" d="M10 12l-3-3h6l-3 3z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}

export default Select
