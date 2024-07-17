import { useEffect, useState } from 'react'

export const useDebouncedValue = <T>(
  value: T,
  debounceTime: number,
  callback?: () => void,
) => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
      callback?.()
    }, debounceTime)
    return () => {
      clearTimeout(timeout)
    }
  }, [value, debounceTime, callback])
  return debouncedValue
}
