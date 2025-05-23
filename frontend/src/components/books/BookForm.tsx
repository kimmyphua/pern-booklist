import useGetAuthorOptions from 'components/authors/hooks/useGetAuthorOptions';
import Button from 'components/button/Button';
import InputGroup from 'components/forms/InputGroup';
import Select from 'components/forms/Select';
import React from 'react';
import { Option } from 'utils/types';
import { CreateBook, DEFAULT_SELECTED_AUTHOR_VALUE, UpdateBook } from './constants';

interface BookFormProps {
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  book: CreateBook | UpdateBook;
  handleAuthorChange: (val: Option[]) => void;
  handleBookChange: (name: string, value: number | string) => void;
  authors: Option<string>[] | undefined;
}

const BookForm = (props: BookFormProps) => {
  const { handleSubmit, book, authors, handleAuthorChange, handleBookChange } = props;
  const { authorOptions, authorsIsLoading } = useGetAuthorOptions();

  return (
    <div className="flex items-center justify-center p-10">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-6/12">
        <InputGroup
          prefix="Title :"
          name="title"
          type="text"
          placeholder="e.g. Book Title"
          value={book.title}
          onChange={(e) => {
            handleBookChange(e.target.name, e.target.value);
          }}
        />

        <Select
          value={authors?.map((a) => a.value) || []}
          onChange={(selectedValues) => {
            const selectedAuthors = authorOptions.filter((a) => selectedValues.includes(a.value));
            handleAuthorChange(selectedAuthors);
          }}
          options={authorOptions}
          disabled={authorsIsLoading}
          prefix={'Authors :'}
        />
        <InputGroup
          prefix="Year Published :"
          name="yearPublished"
          type="number"
          placeholder="e.g. 2011"
          value={(book.yearPublished ?? '').toString()}
          onChange={(e) => {
            handleBookChange(e.target.name, Number(e.target.value));
          }}
        />
        <InputGroup
          prefix="Pages :"
          name="noOfPages"
          type="number"
          placeholder="e.g. 1000"
          value={(book.noOfPages ?? '').toString()}
          onChange={(e) => {
            handleBookChange(e.target.name, Number(e.target.value));
          }}
        />
        <Button
          type="submit"
          disabled={authorsIsLoading || book.title.trim().length < 1 || !authors?.length}
          variant={'teal'}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default BookForm;
