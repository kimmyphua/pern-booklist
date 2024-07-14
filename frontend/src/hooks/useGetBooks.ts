import { useQuery } from '@apollo/client'
import { GET_BOOKS } from '../data/books'
import { useCallback, useState } from 'react'

export const useGetBooks = () => {
  const [title, setTitle] = useState('')

  const handleTextChange = useCallback((value: string) => {
    setTitle(value)
  }, [])

  const [author, setAuthor] = useState(null)
  const [yearPublished, setYearPublished] = useState(null)
  const [noOfPages, setNoPages] = useState(null)
  const { loading, error, data } = useQuery(GET_BOOKS, {
    variables: { title, author, yearPublished, noOfPages }
  })

  return {
    loading,
    error,
    data,
    handleTextChange
  }
}
