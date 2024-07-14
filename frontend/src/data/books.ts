import { gql } from '@apollo/client'

export const CREATE_BOOK = gql`
  mutation CreateBook($title: String!, $authorId: ID!) {
    createBook(title: $title, authorId: $authorId) {
      id
      title
      author {
        name
      }
    }
  }
`

export const ALL_BOOKS = gql`
  query allBooks {
    books {
      id
      title
      author
    }
  }
`
export const DELETE_BOOK = gql`
  mutation DeleteBook($deleteBookId: ID!) {
    deleteBook(id: $deleteBookId)
  }
`
export const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $updateBookId: ID!
    $title: String
    $authorId: ID
    $yearPublished: Int
    $noOfPages: Int
  ) {
    updateBook(
      id: $updateBookId
      title: $title
      authorId: $authorId
      yearPublished: $yearPublished
      noOfPages: $noOfPages
    ) {
      id
      title
      author {
        name
      }
      yearPublished
      noOfPages
    }
  }
`
export const GET_BOOKS = gql`
  query GetBooks(
    $title: String
    $author: String
    $yearPublished: Int
    $noOfPages: Int
  ) {
    searchBooks(
      title: $title
      author: $author
      yearPublished: $yearPublished
      noOfPages: $noOfPages
    ) {
      id
      title
      author {
        name
        id
      }
      yearPublished
      noOfPages
    }
  }
`
