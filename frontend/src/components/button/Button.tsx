import classNames from 'classnames'
import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'teal' | 'disabled' | 'red' | 'grey'
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  variant,
  className,
  children,
  ...props
}) => {
  const baseStyles =
    'px-5 py-2 rounded text-white font-semibold focus:outline-none'

  const variantStyles = {
    teal: 'bg-teal-500 hover:bg-teal-600',
    disabled: 'bg-gray-300 cursor-not-allowed',
    red: 'bg-red-500 hover:bg-red-600',
    grey: 'bg-gray-500 hover:bg-gray-600'
  }

  return (
    <button
      className={classNames(
        `${baseStyles} ${variantStyles[props.disabled ? 'disabled' : variant]}`,
        className
      )}
      disabled={variant === 'disabled' || props.disabled}
      {...props}>
      {children}
    </button>
  )
}

export default Button
