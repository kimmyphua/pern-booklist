import React from 'react'
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client'
import './App.css'
import AuthorList from './components/authors/AuthorList'
import AddAuthor from './components/authors/AddAuthor'
import EditAuthor from './components/authors/EditAuthor'
import AuthorDetail from './components/authors/AuthorDetail'
import BookList from './components/books/BookList'
import AddBook from './components/books/AddBook'
import EditBook from './components/books/EditBook'
import BookDetail from './components/books/BookDetail'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Navbar from 'components/navbar/Navbar'
import { Suspense } from 'react'

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
})

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Navbar />
          <Routes>
            {/* Author Routes */}
            <Route path="/authors" element={<AuthorList />} />
            <Route path="/authors/add" element={<AddAuthor />} />
            <Route path="/authors/:id/edit" element={<EditAuthor />} />
            <Route path="/authors/:id" element={<AuthorDetail />} />

            {/* Book Routes */}
            <Route path="/books" element={<BookList />} />
            <Route path="/books/add" element={<AddBook />} />
            <Route path="/books/:id/edit" element={<EditBook />} />
            <Route path="/books/:id" element={<BookDetail />} />

            {/* Redirect from root to /books */}
            <Route path="/" element={<Navigate to="/books" />} />
          </Routes>
        </Router>
      </Suspense>
    </div>
  </ApolloProvider>
)

export default App
