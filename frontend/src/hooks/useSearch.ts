import React, { useCallback, useState } from 'react'

function useSearch() {
  const [searchText, setSearchText] = useState<string>('')

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(event.target.value)
    },
    []
  )

  const clearSearchText = useCallback(() => {
    setSearchText('')
  }, [])

  return {
    searchText,
    handleInputChange,
    clearSearchText
  }
}

export default useSearch
