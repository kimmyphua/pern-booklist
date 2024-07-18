import { useMemo } from 'react'
import { Option } from '../../../utils/types'
import { useQuery } from '@apollo/client'
import { GET_AUTHORS } from 'data/authors'

function useGetAuthorOptions() {
  const { data: authors, loading: authorsIsLoading } = useQuery(GET_AUTHORS)
  const authorOptions: Option[] = useMemo(
    () =>
      authors?.getAuthors?.map((author: { id: number; name: string }) => ({
        value: author.id,
        label: author.name
      })) ?? [],
    [authors]
  )

  return {
    authors,
    authorOptions,
    authorsIsLoading
  }
}

export default useGetAuthorOptions
