import classNames from 'classnames'
import React, { forwardRef } from 'react'
import type { ReactNode } from 'react'

export interface InputGroupProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  handleChange?: React.ChangeEventHandler<HTMLInputElement>
  type?: React.HTMLInputTypeAttribute
  id?: string
  name?: string
  placeholder?: string
  prefix?: ReactNode
  suffix?: ReactNode
}

const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  (props, ref) => {
    const {
      className = '',
      handleChange,
      prefix,
      suffix,
      ...otherProps
    } = props
    const { disabled } = otherProps

    return (
      <div
        className={classNames(
          'flex',
          'w-full',
          {
            'opacity-50 cursor-not-allowed': disabled
          },
          className
        )}>
        {prefix && (
          <div className="flex">
            <span className="flex items-center px-2 py-2 text-base leading-tight text-gray-700 bg-white border border-r-0 border-gray-300 rounded-l-md">
              {prefix}
            </span>
          </div>
        )}
        <input
          ref={ref}
          className={classNames(
            'flex-1 px-4 py-2 text-base leading-tight border border-gray-300 rounded focus:border-blue-500',
            {
              'border-l-0 rounded-l-none': prefix,
              'border-r-0 rounded-r-none': suffix
            }
          )}
          onChange={handleChange}
          {...otherProps}
        />
        {suffix && (
          <div className="flex">
            <span className="flex items-center px-2 py-2 text-base leading-tight text-gray-700 bg-white border border-l-0 border-gray-300 rounded-r-md">
              {suffix}
            </span>
          </div>
        )}
      </div>
    )
  }
)

InputGroup.displayName = 'InputGroup'

export default InputGroup
