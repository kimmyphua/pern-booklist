import classNames from 'classnames'
import React, { ReactNode } from 'react'

interface SelectProps {
  value: string | number
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: { value: string; label: string }[]
  defaultOption?: { value: string; label: string }
  disabled?: boolean
  prefix?: ReactNode
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  defaultOption,
  disabled = false,
  prefix
}) => {
  return (
    <div className="flex w-full relative">
      {prefix && (
        <div className="flex">
          <span className="flex items-center px-2 py-2 text-base leading-tight text-gray-700 bg-white border border-r-0 border-gray-300 rounded-l-md w-max">
            {prefix}
          </span>
        </div>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={classNames(
          'block w-full px-2 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-l-none appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
          {
            'border-l-0 rounded-l-none': prefix
          }
        )}>
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
          className="w-8 h-8 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path fillRule="evenodd" d="M10 12l-3-3h6l-3 3z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  )
}

export default Select
