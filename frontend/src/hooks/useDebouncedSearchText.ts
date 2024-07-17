import { useCallback, useState } from 'react'
import { useDebouncedValue } from './useDebouncedValue'

const useDebouncedSearchText = (ms = 300, callback?: () => void) => {
  const [searchText, setSearchText] = useState('')
  const debouncedSearchText = useDebouncedValue(searchText, ms, callback)

  const handleTextChange = useCallback((value: string) => {
    setSearchText(value)
  }, [])

  const onInputSearch = useCallback(
    (event: { value: string }) => handleTextChange(event.value),
    [handleTextChange],
  )
  return {
    debouncedSearchText,
    handleTextChange,
    onInputSearch,
  }
}

export default useDebouncedSearchText
