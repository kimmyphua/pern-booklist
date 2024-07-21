import React, { useCallback, useState } from 'react'
import BookForm from './BookForm'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, GET_BOOKS } from 'data/books'
import useFilterByOptions from 'hooks/useFilterByOptions'
import {
  CreateBook,
  DEFAULT_BOOK_INPUT,
  DEFAULT_SELECTED_AUTHOR_VALUE
} from './constants'
import { Option } from 'utils/types'

function AddBook() {
  const [book, setBook] = useState<CreateBook>(DEFAULT_BOOK_INPUT)

  const [author, setAuthor] = useFilterByOptions(DEFAULT_SELECTED_AUTHOR_VALUE)

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      {
        query: GET_BOOKS,
        variables: {
          title: '',
          authorId: null,
          yearPublished: null,
          noOfPages: null
        }
      }
    ]
  })
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      createBook({ variables: { ...book, authorId: author?.value } })
      setAuthor(DEFAULT_SELECTED_AUTHOR_VALUE)
      setBook(DEFAULT_BOOK_INPUT)
    },
    [author?.value, book, createBook, setAuthor]
  )
  const handleAuthorChange = useCallback(
    (val: Option) => {
      setAuthor(val)
    },
    [setAuthor]
  )
  const handleBookChange = useCallback(
    (name: string, value: number | string) => {
      setBook({
        ...book,
        [name]: value
      })
    },
    [book]
  )
  return (
    <div>
      <BookForm
        handleSubmit={handleSubmit}
        book={book}
        author={author}
        handleAuthorChange={handleAuthorChange}
        handleBookChange={handleBookChange}
      />
    </div>
  )
}

export default AddBook
