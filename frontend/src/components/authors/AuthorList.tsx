import { Link, useNavigate } from 'react-router-dom'
import useGetAuthors from './hooks/useGetAuthors'
import Table from 'components/table/Table'
import Button from 'components/button/Button'
import SearchInput from 'components/forms/SearchInput'

interface Author {
  id: number
  name: string
  books: {
    id: number
    title: string
  }[]
}

function AuthorList() {
  const { loading, error, data, onInputSearch, name } = useGetAuthors()
  const authorData = (data as { searchAuthors: Author[] })?.searchAuthors
  const navigate = useNavigate()
  const columns = [
    {
      header: 'Name',
      accessor: '',
      render: (data: Author) => (
        <Link to={`/author/${data?.id}`}>{data?.name}</Link>
      )
    },
    {
      header: 'No, of books',
      accessor: 'books',
      render: (
        books: {
          id: number
          title: string
        }[]
      ) => books?.length
    }
  ]

  return (
    <div className="mx-10 mt-5">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 my-2">
        <div className="flex flex-col sm:flex-row gap-2 w-4/12">
          <SearchInput handleTextChange={onInputSearch} value={name} />
        </div>
        <Button
          type="submit"
          variant={'teal'}
          onClick={() => navigate('/authors/add')}>
          Add Author
        </Button>
      </div>
      <Table
        data={authorData}
        columns={columns}
        loading={loading}
        error={error != null}
      />
    </div>
  )
}

export default AuthorList
