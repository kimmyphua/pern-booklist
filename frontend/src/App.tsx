import React from 'react'
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client'
import BookForm from './components/BookForm'
import BookList from './components/BookList'
import './App.css'
import AuthorList from './components/authors/AuthorList'
import AuthorForm from './components/authors/AuthorForm'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <div className="App">
      <AuthorForm />
      <AuthorList />
      <BookForm />
      <BookList />
    </div>
  </ApolloProvider>
)

export default App
