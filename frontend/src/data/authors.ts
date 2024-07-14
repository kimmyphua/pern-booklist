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
