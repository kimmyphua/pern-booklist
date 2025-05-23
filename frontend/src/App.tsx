import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Navbar from 'components/navbar/Navbar';
import React, { Suspense } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AddAuthor from './components/authors/AddAuthor';
import AuthorDetail from './components/authors/AuthorDetail';
import AuthorList from './components/authors/AuthorList';
import EditAuthor from './components/authors/EditAuthor';
import AddBook from './components/books/AddBook';
import BookDetail from './components/books/BookDetail';
import BookList from './components/books/BookList';
import EditBook from './components/books/EditBook';

const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql',
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token') ?? '123';
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${token}`,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

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
);

export default App;
