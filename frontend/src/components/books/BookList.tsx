import React from 'react'
import useSearch from '../../hooks/useSearch'
import { useGetBooks } from './hooks/useGetBooks'
import { useDeleteBook } from './hooks/useDeleteBook'
import Table from 'components/table/Table'
import { Link } from 'react-router-dom'
import SearchInput from 'components/forms/SearchInput'
import Select from 'components/forms/Select'

interface Book {
  id: number
  title: string
  author: { name: string }
  yearPublished?: number
  noOfPages?: number
}

const BookList: React.FC = () => {
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
      <div className="flex gap-2 my-2">
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
