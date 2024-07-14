import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_AUTHOR, GET_AUTHORS } from '../../data/authors'

const AuthorForm: React.FC = () => {
  const [author, setAuthor] = useState('')
  const [createAuthor] = useMutation(CREATE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS }]
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createAuthor({ variables: { name: author } })
    setAuthor('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <button type="submit">Add Author</button>
    </form>
  )
}

export default AuthorForm
