import React, { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client'
import { CREATE_BOOK, GET_BOOKS } from '../../data/books'
import { GET_AUTHORS } from '../../data/authors'

const BookForm: React.FC = () => {
  const [title, setTitle] = useState('')

  const [createBook] = useMutation(CREATE_BOOK, {
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
  const { loading, error, data } = useQuery(GET_AUTHORS)
  const authorOptions = useMemo(
    () =>
      data?.getAuthors?.map((author: { id: number; name: string }) => ({
        id: author.id,
        name: author.name
      })) ?? [],
    [data]
  )
  const [authorId, setAuthorId] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createBook({ variables: { title, authorId } })
    setTitle('')
    setAuthorId(authorOptions[0].id)
  }

  console.log({ authorOptions, authorId })
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <select
        defaultValue={''}
        value={authorId}
        onChange={(e) => setAuthorId(e.target.value)}>
        <option value={''} disabled>
          Choose an option
        </option>
        {authorOptions.map((author: { id: number; name: string }) => (
          <option key={author.id} value={author.id}>
            {author.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={authorId.length < 1 || title.trim().length < 1}>
        Add Book
      </button>
    </form>
  )
}

export default BookForm
