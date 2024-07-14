import React from 'react'
import { GET_AUTHORS } from '../../data/authors'
import { useQuery } from '@apollo/client'

function AuthorList() {
  const { loading, error, data } = useQuery(GET_AUTHORS)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>
  return data.getAuthors?.map((author: { id: number; name: string }) => (
    <div key={author.id}>
      <p>{author.name}</p>
    </div>
  ))
}

export default AuthorList
