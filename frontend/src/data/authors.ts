import { gql } from '@apollo/client'

export const CREATE_AUTHOR = gql`
  mutation CreateAuthor($name: String!) {
    createAuthor(name: $name) {
      id
      name
    }
  }
`
export const GET_AUTHORS = gql`
  query GetAuthors {
    getAuthors {
      id
      name
      books {
        title
        id
        yearPublished
        noOfPages
      }
    }
  }
`

export const SEARCH_AUTHORS = gql`
  query SearchAuthors($name: String) {
    searchAuthors(name: $name) {
      id
      name
      books {
        title
        id
        yearPublished
        noOfPages
      }
    }
  }
`
