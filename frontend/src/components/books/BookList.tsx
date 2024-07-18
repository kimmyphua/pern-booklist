import React from 'react'
import { useGetBooks } from './hooks/useGetBooks'
import { useDeleteBook } from './hooks/useDeleteBook'
import Table from 'components/table/Table'
import { Link, useNavigate } from 'react-router-dom'
import SearchInput from 'components/forms/SearchInput'
import Select from 'components/forms/Select'
import Button from 'components/button/Button'

interface Book {
  id: number
  title: string
  author: { name: string }
  yearPublished?: number
  noOfPages?: number
}

const BookList: React.FC = () => {
  const navigate = useNavigate()
  const {
    loading,
    error,
    data,
    onInputSearch,
    title,
    author,
    setAuthor,
    authorOptions
  } = useGetBooks()
  const { handleDelete } = useDeleteBook()

  const bookData = (data as { searchBooks: Book[] })?.searchBooks
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
    <div className="mx-10 mt-5">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 my-2">
        <div className="flex flex-col sm:flex-row gap-2 w-6/12">
          <SearchInput handleTextChange={onInputSearch} value={title} />
          <Select
            value={author?.value ?? ''}
            onChange={(e) => {
              const selected = authorOptions.find(
                (a) => a.value === e.target.value
              )
              if (selected) setAuthor(selected)
            }}
            options={authorOptions}
          />
        </div>
        <Button
          type="submit"
          variant={'teal'}
          onClick={() => navigate('/books/add')}>
          Add Book
        </Button>
      </div>
      <Table
        data={bookData}
        columns={columns}
        loading={loading}
        error={error != null}
      />
    </div>
  )
}

export default BookList
