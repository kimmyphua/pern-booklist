import { useCallback, useState } from 'react'

export type Option<T = string> = {
  label: string
  value: T
}
const useFilterByOptions = (
  defaultSelected?: Option,
  handleFilterCallback?: (val?: Option) => void
) => {
  const [selected, setSelected] = useState<Option | undefined>(defaultSelected)
  const handleFilter = useCallback(
    (val?: Option) => {
      setSelected(val)
      handleFilterCallback?.(val)
    },
    [handleFilterCallback]
  )

  return [selected, handleFilter] as const
}

export default useFilterByOptions
