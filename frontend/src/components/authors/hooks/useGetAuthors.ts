import { useQuery } from '@apollo/client'
import { SEARCH_AUTHORS } from 'data/authors'
import useDebouncedSearchText from 'hooks/useDebouncedSearchText'

function useGetAuthors() {
  const { debouncedSearchText: name, onInputSearch } =
    useDebouncedSearchText(100)

  const { data, error, loading } = useQuery(SEARCH_AUTHORS, {
    variables: { name }
  })
  return { data, error, loading, onInputSearch, name }
}
export default useGetAuthors
