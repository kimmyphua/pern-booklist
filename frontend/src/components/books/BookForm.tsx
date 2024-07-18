import React, { useCallback, useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_BOOK, GET_BOOKS } from '../../data/books'
import useGetAuthorOptions from 'components/authors/hooks/useGetAuthorOptions'
import Select from 'components/forms/Select'
import useFilterByOptions from 'hooks/useFilterByOptions'
import InputGroup from 'components/forms/InputGroup'
import Button from 'components/button/Button'

interface CreateBook {
  title: string
  yearPublished?: number | null
  noOfPages?: number | null
}

const DEFAULT_SELECTED_VALUE = {
  label: 'Choose an author',
  value: ''
}

const DEFAULT_BOOK_INPUT = {
  title: '',
  yearPublished: null,
  noOfPages: null
}
const BookForm: React.FC = () => {
  const { authorOptions, authorsIsLoading } = useGetAuthorOptions()

  const [book, setBook] = useState<CreateBook>(DEFAULT_BOOK_INPUT)

  const [author, setAuthor] = useFilterByOptions(DEFAULT_SELECTED_VALUE)

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
      console.log({ book })

      e.preventDefault()
      createBook({ variables: { ...book, authorId: author?.value } })
      setAuthor(DEFAULT_SELECTED_VALUE)
      setBook(DEFAULT_BOOK_INPUT)
    },
    [author?.value, book, createBook, setAuthor]
  )

  const authorList = [DEFAULT_SELECTED_VALUE, ...authorOptions]
  return (
    <div className="flex items-center justify-center p-10">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-5 w-6/12">
        <InputGroup
          type="text"
          placeholder="Title"
          value={book.title}
          onChange={(e) => setBook({ ...book, title: e.target.value })}
        />
        <Select
          value={author?.value ?? ''}
          onChange={(e) => {
            const selected = authorList.find((a) => a.value === e.target.value)
            if (selected) setAuthor(selected)
          }}
          options={authorList}
          disabled={authorsIsLoading}
        />
        <InputGroup
          type="number"
          placeholder="Year Published"
          value={(book.yearPublished ?? '').toString()}
          onChange={(e) =>
            setBook({ ...book, yearPublished: Number(e.target.value) })
          }
        />
        <InputGroup
          type="number"
          placeholder="Pages"
          value={(book.noOfPages ?? '').toString()}
          onChange={(e) =>
            setBook({ ...book, noOfPages: Number(e.target.value) })
          }
        />
        <Button
          type="submit"
          disabled={
            authorsIsLoading ||
            book.title.trim().length < 1 ||
            author?.value === ''
          }
          variant={'teal'}>
          Submit
        </Button>
      </form>
    </div>
  )
}

export default BookForm
