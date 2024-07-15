import React from 'react'
import useSearch from '../../hooks/useSearch'
import { useGetBooks } from '../../hooks/useGetBooks'
import { useDeleteBook } from '../../hooks/useDeleteBook'
import Table from 'components/table/Table'
import { Link } from 'react-router-dom'

interface Book {
  id: number
  title: string
  author: { name: string }
  yearPublished?: number
  noOfPages?: number
}

const BookList: React.FC = () => {
  const { searchText, handleInputChange, clearSearchText } = useSearch()
  const { loading, error, data, handleTextChange } = useGetBooks()
  const { handleDelete } = useDeleteBook()

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  const bookData = data.searchBooks
  const columns = [
    {
      header: 'Title',
      accessor: '',
      render: (data: Book) => (
        <Link to={`/books/${data?.id}`}>{data?.title}</Link>
      )
    },
    {
      header: 'Author',
      accessor: 'author.name'
    },
    {
      header: 'Year Published',
      accessor: 'yearPublished'
    },
    {
      header: 'Pages',
      accessor: 'noOfPages'
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id: number) => (
        <button onClick={() => handleDelete(id)}>Delete</button>
      )
    }
  ]

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
      <Table data={bookData} columns={columns} />
    </div>
  )
}

export default BookList
