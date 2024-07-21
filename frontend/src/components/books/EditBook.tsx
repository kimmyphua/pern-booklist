import React, { useCallback, useEffect, useMemo, useState } from 'react'
import BookForm from './BookForm'
import { useMutation, useQuery } from '@apollo/client'
import { GET_BOOK, GET_BOOKS, UPDATE_BOOK } from 'data/books'
import useFilterByOptions from 'hooks/useFilterByOptions'
import {
  DEFAULT_BOOK_INPUT,
  DEFAULT_SELECTED_AUTHOR_VALUE,
  UpdateBook
} from './constants'
import { Option } from 'utils/types'
import { useParams } from 'react-router-dom'
import { ReactComponent as CloseIcon } from '../icons/close.svg'

function EditBook() {
  const params = useParams()
  const { id } = params
  const { data, error, loading } = useQuery(GET_BOOK, {
    variables: { id }
  })
  const defaultBookState = useMemo(() => data?.getBook, [data])

  const defaultAuthorOption = useMemo(
    () => ({
      label: defaultBookState?.author?.name,
      value: defaultBookState?.author?.id
    }),
    [defaultBookState]
  )

  const [book, setBook] = useState<UpdateBook>({
    id: Number(id) ?? 0,
    ...DEFAULT_BOOK_INPUT
  })

  const [author, setAuthor] = useFilterByOptions(DEFAULT_SELECTED_AUTHOR_VALUE)
  useEffect(() => {
    defaultBookState != null && setBook(defaultBookState)
    defaultBookState != null && setAuthor(defaultAuthorOption)
  }, [defaultAuthorOption, defaultBookState, setAuthor])

  const [
    updateBook,
    { data: submittedData, loading: isSubmitting, error: submitError, reset }
  ] = useMutation(UPDATE_BOOK, {
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

      updateBook({
        variables: { ...book, updateBookId: id, authorId: author?.value }
      })
    },
    [author?.value, book, id, updateBook]
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

  const renderSubmitMessage = () => {
    if (isSubmitting)
      return (
        <h4 className=" px-3 py-2 rounded flex text-stone-600 bg-amber-200">
          Submitting...
        </h4>
      )
    if (submitError)
      return (
        <h4 className="bg-rose-200 px-3 py-2 rounded flex text-stone-600">
          <span className="mr-2">
            Error updating book : <i>{submitError.message}</i>
          </span>
          <CloseIcon
            onClick={reset}
            className="cursor-pointer fill-stone-600 hover:fill-stone-800"
          />
        </h4>
      )
    if (submittedData)
      return (
        <h4 className="bg-teal-200 px-3 py-2 rounded flex text-stone-600">
          <span className="mr-2">
            Successfully updated book : <b>{submittedData.updateBook.title}</b>
          </span>
          <CloseIcon
            onClick={reset}
            className="cursor-pointer fill-stone-600 hover:fill-stone-800"
          />
        </h4>
      )
    return <></>
  }
  
  if (loading) {
    return <>Loading...</>
  }
  if (error) {
    return <>Error, Please refresh or try again later</>
  }
  return (
    <>
      <BookForm
        handleSubmit={handleSubmit}
        book={book}
        author={author}
        handleAuthorChange={handleAuthorChange}
        handleBookChange={handleBookChange}
      />
      <div className="flex justify-center items-center">
        {renderSubmitMessage()}
      </div>
    </>
  )
}

export default EditBook
