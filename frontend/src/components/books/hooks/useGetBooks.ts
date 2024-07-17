import { useQuery } from '@apollo/client'
import { GET_BOOKS } from '../../../data/books'
import { useCallback, useMemo, useState } from 'react'
import useDebouncedSearchText from '../../../hooks/useDebouncedSearchText'
import { GET_AUTHORS } from 'data/authors'
import useFilterByOptions from 'hooks/useFilterByOptions'
const DEFAULT_OPTION = {
  label: 'All',
  value: ''
}
type Option<T = string> = {
  label: string
  value: T
}
export const useGetBooks = () => {
  // const [title, setTitle] = useState('')
  const { debouncedSearchText: title, onInputSearch } =
    useDebouncedSearchText(200)
  // const handleTextChange = useCallback((value: string) => {
  //   setTitle(value)
  // }, [])
  const { data: authors } = useQuery(GET_AUTHORS)
  const authorOptions: Option[] = useMemo(
    () =>
      authors?.getAuthors?.map((author: { id: number; name: string }) => ({
        value: author.name,
        label: author.name
      })) ?? [],
    [authors]
  )

  const [author, setAuthor] = useFilterByOptions(DEFAULT_OPTION)

  const [yearPublished, setYearPublished] = useState(null)
  const [noOfPages, setNoPages] = useState(null)
  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: {
      title,
      author: author?.value === '' ? null : author?.value,
      yearPublished,
      noOfPages
    }
  })

  return {
    loading,
    error,
    data,
    onInputSearch,
    title,
    setAuthor,
    author,
    authorOptions: [...authorOptions, DEFAULT_OPTION]
  }
}
