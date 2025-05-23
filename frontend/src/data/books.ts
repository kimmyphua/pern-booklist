import { gql } from '@apollo/client';

export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $authorIds: [ID]!, $yearPublished: Int, $noOfPages: Int) {
    createBook(
      title: $title
      authorIds: $authorIds
      yearPublished: $yearPublished
      noOfPages: $noOfPages
    ) {
      id
      title
      yearPublished
      noOfPages
      authors {
        name
      }
    }
  }
`;

export const ALL_BOOKS = gql`
  query allBooks {
    books {
      id
      title
      authors {
        name
      }
    }
  }
`;
export const DELETE_BOOK = gql`
  mutation DeleteBook($deleteBookId: ID!) {
    deleteBook(id: $deleteBookId)
  }
`;
export const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $updateBookId: ID!
    $title: String
    $authorIds: [ID]
    $yearPublished: Int
    $noOfPages: Int
  ) {
    updateBook(
      id: $updateBookId
      title: $title
      authorIds: $authorIds
      yearPublished: $yearPublished
      noOfPages: $noOfPages
    ) {
      id
      title
      authors {
        name
      }
      yearPublished
      noOfPages
    }
  }
`;
export const GET_BOOKS = gql`
  query GetBooks(
    $title: String
    $authorIds: [ID]
    $yearPublished: RangeInput
    $noOfPages: RangeInput
  ) {
    searchBooks(
      title: $title
      authorIds: $authorIds
      yearPublished: $yearPublished
      noOfPages: $noOfPages
    ) {
      id
      title
      authors {
        name
        id
      }
      yearPublished
      noOfPages
    }
  }
`;

export const GET_BOOK = gql`
  query GetBook($id: ID!) {
    getBook(id: $id) {
      id
      title
      authors {
        name
        id
      }
      yearPublished
      noOfPages
    }
  }
`;
