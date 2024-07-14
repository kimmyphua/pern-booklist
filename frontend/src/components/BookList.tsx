import React from 'react'
import useSearch from '../hooks/useSearch'
import { useGetBooks } from '../hooks/useGetBooks'
import { useDeleteBook } from '../hooks/useDeleteBook'

const BookList: React.FC = () => {
  const { searchText, handleInputChange, clearSearchText } = useSearch()
  const { loading, error, data, handleTextChange } = useGetBooks()
  const { handleDelete } = useDeleteBook()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <input
        placeholder="Search Book Title"
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleTextChange(searchText)
          }
        }}
      />
      <button
        onClick={() => {
          handleTextChange(searchText)
        }}>
        search
      </button>
      <button
        onClick={() => {
          clearSearchText()
          handleTextChange('')
        }}>
        clear
      </button>
      {data.searchBooks?.map(
        (book: { id: number; title: string; author: { name: string } }) => (
          <div key={book.id}>
            <p>
              {book.title} by {book.author.name}
              <button onClick={() => handleDelete(book.id)}> x </button>
            </p>
          </div>
        )
      )}
    </div>
  )
}

export default BookList
