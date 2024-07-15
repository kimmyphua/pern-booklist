import React from 'react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg font-semibold">
          <Link to="/" relative="path">
            PERN BookList
          </Link>
        </div>
        <div className="space-x-4">
          <Link
            to="/authors"
            relative="path"
            className="text-gray-300 hover:text-white">
            Authors
          </Link>
          <Link
            to="/books"
            relative="path"
            className="text-gray-300 hover:text-white">
            Books
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
