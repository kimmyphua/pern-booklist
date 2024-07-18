import { useQuery } from '@apollo/client'
import { GET_BOOKS } from '../../../data/books'

import { useState } from 'react'
import useDebouncedSearchText from '../../../hooks/useDebouncedSearchText'
import useFilterByOptions from 'hooks/useFilterByOptions'
import useGetAuthorOptions from 'components/authors/hooks/useGetAuthorOptions'

const DEFAULT_OPTION = {
  label: 'All Authors',
  value: ''
}

export const useGetBooks = () => {
  const { debouncedSearchText: title, onInputSearch } =
    useDebouncedSearchText(100)

  const { authorOptions } = useGetAuthorOptions()

  const [author, setAuthor] = useFilterByOptions(DEFAULT_OPTION)

  const [yearPublished, setYearPublished] = useState(null)
  const [noOfPages, setNoPages] = useState(null)
  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: {
      title,
      authorId: author?.value === '' ? null : author?.value,
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
