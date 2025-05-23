import React from 'react';
import { useGetBooks } from './hooks/useGetBooks';
import { useDeleteBook } from './hooks/useDeleteBook';
import Table from 'components/table/Table';
import { Link, useNavigate } from 'react-router-dom';
import SearchInput from 'components/forms/SearchInput';
import Select from 'components/forms/Select';
import Button from 'components/button/Button';

interface Book {
  id: number;
  title: string;
  authors: { name: string }[];
  yearPublished?: number;
  noOfPages?: number;
}

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading,
    error,
    data,
    onInputSearch,
    title,
    authors,
    setAuthors,
    authorOptions,
    refetch,
  } = useGetBooks();
  const { handleDelete } = useDeleteBook();

  const bookData = (data as { searchBooks: Book[] })?.searchBooks;

  const columns = [
    {
      header: 'Title',
      accessor: '',
      render: (data: Book) => <Link to={`/books/${data?.id}/edit`}>{data?.title}</Link>,
    },
    {
      header: 'Author',
      accessor: 'authors',
      render: (data: { name: string }[]) => {
        return <div>{data.map((author) => author.name).join(', ')}</div>;
      },
    },
    {
      header: 'Year Published',
      accessor: 'yearPublished',
    },
    {
      header: 'Pages',
      accessor: 'noOfPages',
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id: number) => (
        <button onClick={() => handleDelete(id).then(() => refetch())}>Delete</button>
      ),
    },
  ];

  return (
    <div className="mx-10 mt-5">
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 my-2">
        <div className="flex flex-col sm:flex-row gap-2 w-6/12">
          <SearchInput handleTextChange={onInputSearch} value={title} />
          <Select
            value={authors?.map((a) => a.value) ?? []}
            onChange={(selectedValues) => {
              const selectedAuthors = authorOptions.filter((a) => selectedValues.includes(a.value));
              if (selectedAuthors) setAuthors(selectedAuthors);
            }}
            options={authorOptions}
          />
        </div>
        <Button type="submit" variant={'teal'} onClick={() => navigate('/books/add')}>
          Add Book
        </Button>
      </div>
      <Table data={bookData} columns={columns} loading={loading} error={error != null} />
    </div>
  );
};

export default BookList;
