import React, { useCallback, useState } from 'react';
import BookForm from './BookForm';
import { useMutation } from '@apollo/client';
import { CREATE_BOOK, GET_BOOKS } from 'data/books';
import useFilterByOptions from 'hooks/useFilterByOptions';
import { CreateBook, DEFAULT_BOOK_INPUT, DEFAULT_SELECTED_AUTHOR_VALUE } from './constants';
import { Option } from 'utils/types';

function AddBook() {
  const [book, setBook] = useState<CreateBook>(DEFAULT_BOOK_INPUT);

  const [authors, setAuthors] = useFilterByOptions([]);

  const [createBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [
      {
        query: GET_BOOKS,
        variables: {
          title: '',
          authorIds: null,
          yearPublished: null,
          noOfPages: null,
        },
      },
    ],
  });
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      createBook({ variables: { ...book, authorIds: authors?.map((author) => author.value) } });
      setAuthors([]);
      setBook(DEFAULT_BOOK_INPUT);
    },
    [authors, book, createBook, setAuthors]
  );
  const handleAuthorChange = useCallback(
    (val: Option[]) => {
      setAuthors(val);
    },
    [setAuthors, authors]
  );
  const handleBookChange = useCallback(
    (name: string, value: number | string) => {
      setBook({
        ...book,
        [name]: value,
      });
    },
    [book]
  );
  return (
    <div>
      <BookForm
        handleSubmit={handleSubmit}
        book={book}
        authors={authors}
        handleAuthorChange={handleAuthorChange}
        handleBookChange={handleBookChange}
      />
    </div>
  );
}

export default AddBook;
