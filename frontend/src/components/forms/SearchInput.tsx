import classNames from 'classnames'
import React, { useState, useCallback, useLayoutEffect } from 'react'
import type { FunctionComponent } from 'react'

import InputGroup from './InputGroup'
import type { InputGroupProps } from './InputGroup'
import { isDefined } from 'utils/helpers'
import { ReactComponent as SearchIcon } from '../icons/search.svg'
interface Props extends InputGroupProps {
  /**
   * Event handler function, called on text change
   */
  handleTextChange?: (event: { value: string }) => void
}

const SearchInput: FunctionComponent<Props> = (props) => {
  const {
    className = '',
    handleTextChange,
    value: valueFromProps,
    ...otherProps
  } = props
  const { disabled } = otherProps
  const [value, setValue] = useState(valueFromProps ?? '')

  const isControlled = isDefined(valueFromProps)

  useLayoutEffect(() => {
    if (isControlled) {
      setValue(valueFromProps)
    }
  }, [isControlled, valueFromProps])

  const handleInputChange = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setValue(ev.target.value)
      }
      handleTextChange?.({ value: ev.target.value })
    },
    [isControlled, handleTextChange]
  )

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setValue('')
    }
    handleTextChange?.({ value: '' })
  }, [isControlled, handleTextChange])

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    // Clear on escape key
    if (ev.keyCode === 27 && !!value) {
      handleClear()
    }
  }

  return (
    <InputGroup
      className={classNames('relative', className)} // Use relative positioning to ensure absolute positioning works inside
      placeholder="Search"
      prefix={<SearchIcon />}
      suffix={
        !!value && (
          <span
            className={classNames(
              'flex items-center justify-center', // Flex container
              { 'cursor-pointer filter brightness-75': !disabled } // Apply pointer cursor and brightness on hover if not disabled
            )}
            onClick={disabled ? undefined : handleClear}>
            <> x </>
          </span>
        )
      }
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      value={value}
      {...otherProps}
    />
  )
}

SearchInput.displayName = 'SearchInput'

export default SearchInput
