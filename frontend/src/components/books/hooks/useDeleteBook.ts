import { useMutation } from '@apollo/client'
import { DELETE_BOOK, GET_BOOKS } from 'data/books'
import { useCallback } from 'react'

export const useDeleteBook = () => {
  const [deleteBook] = useMutation(DELETE_BOOK, {
    refetchQueries: [
      {
        query: GET_BOOKS,
        variables: {
          title: '',
          author: null,
          yearPublished: null,
          noOfPages: null
        }
      }
    ]
  })
  const handleDelete = useCallback(
    (id: number) => {
      deleteBook({ variables: { deleteBookId: Number(id) } })
    },
    [deleteBook]
  )

  return {
    handleDelete
  }
}
