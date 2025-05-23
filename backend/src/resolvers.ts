import { In, Repository } from 'typeorm'
import { AppDataSource } from './data-source'
import { Author, Book } from './schema'
import { MyContext } from './types/context'
import { addRangeCondition } from './utils/helpers'

const authorRepository: Repository<Author> = AppDataSource.getRepository(Author)
const bookRepository: Repository<Book> = AppDataSource.getRepository(Book)

export const resolvers = {
  Query: {
    getAuthors: async (_: any, __: any, context: MyContext) => {
      context.logger.info('Fetching all authors')
      return await authorRepository.find({ relations: ['books'] })
    },
    getAuthor: async (_: any, { id }: { id: number }, context: MyContext) => {
      context.logger.info('Fetching author by ID', { id })
      return await authorRepository.findOne({ where: { id }, relations: ['books'] })
    },
    getBooks: async (_: any, __: any, context: MyContext) => {
      context.logger.info('Fetching all books')
      return await bookRepository.find({ relations: ['authors'] })
    },
    getBook: async (_: any, { id }: { id: number }, context: MyContext) => {
      context.logger.info('Fetching book by ID', { id })
      return await bookRepository.findOne({ where: { id }, relations: ['authors'] })
    },
    searchAuthors: async (_: any, { name }: { name?: string }) => {
      const query = authorRepository
        .createQueryBuilder('author')
        .leftJoinAndSelect('author.books', 'books')
      if (name) query.andWhere('author.name ILIKE :name', { name: `%${name}%` })
      return await query.getMany()
    },
    searchBooks: async (
      _: any,
      {
        title,
        authorIds,
        yearPublished,
        noOfPages
      }: {
        title?: string
        authorIds?: number[]
        yearPublished?: {
          start?: number
          end?: number
        }
        noOfPages?: {
          start?: number
          end?: number
        }
      }
    ) => {
      // First, find book IDs that match the author filter
      let bookIds: number[] | undefined
      if (authorIds && authorIds.length > 0) {
        const matchingBooks = await bookRepository
          .createQueryBuilder('book')
          .innerJoin('book.authors', 'author')
          .where('author.id IN (:...authorIds)', { authorIds })
          .select('book.id')
          .getMany()
        bookIds = matchingBooks.map(book => book.id)
      }

      // Then, get all books with their authors, applying all filters
      const query = bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.authors', 'authors')

      if (bookIds) {
        query.andWhere('book.id IN (:...bookIds)', { bookIds })
      }
      if (title) {
        query.andWhere('book.title ILIKE :title', { title: `%${title}%` })
      }

      addRangeCondition(query, 'book.yearPublished', yearPublished)
      addRangeCondition(query, 'book.noOfPages', noOfPages)

      return await query.getMany()
    }
  },
  Mutation: {
    createAuthor: async (_: any, { name }: { name: string }) => {
      const author = authorRepository.create({ name })
      return await authorRepository.save(author)
    },
    createBook: async (
      _: any,
      {
        title,
        authorIds,
        yearPublished,
        noOfPages
      }: {
        title: string
        authorIds: number[]
        yearPublished?: number
        noOfPages?: number
      },
      context: MyContext
    ) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Not authenticated')
      }

      context.logger.info('Creating new book', { title, authorIds })

      const authors = await authorRepository.findBy({ id: In(authorIds) })
      if (authors.length !== authorIds.length) {
        context.logger.error('Some authors not found', { authorIds })
        throw new Error('Some authors not found')
      }

      const newBook = bookRepository.create({
        title,
        authors,
        yearPublished,
        noOfPages
      })

      const savedBook = await bookRepository.save(newBook)
      context.logger.info('Book created successfully', { bookId: savedBook.id })
      return savedBook
    },
    updateBook: async (
      _: any,
      {
        id,
        title,
        authorIds,
        yearPublished,
        noOfPages
      }: {
        id: number
        title?: string
        authorIds?: number[]
        yearPublished?: number
        noOfPages?: number
      },
      context: MyContext
    ) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Not authenticated')
      }

      context.logger.info('Updating book', { id })

      const book = await bookRepository.findOne({
        where: { id },
        relations: ['authors']
      })
      if (!book) {
        context.logger.error('Book not found', { id })
        throw new Error('Book not found')
      }

      if (title) book.title = title
      if (authorIds) {
        const authors = await authorRepository.findBy({ id: In(authorIds) })
        if (authors.length !== authorIds.length) {
          context.logger.error('Some authors not found', { authorIds })
          throw new Error('Some authors not found')
        }
        book.authors = authors
      }
      if (yearPublished != null) book.yearPublished = yearPublished
      if (noOfPages != null) book.noOfPages = noOfPages

      const updatedBook = await bookRepository.save(book)
      context.logger.info('Book updated successfully', { bookId: updatedBook.id })
      return updatedBook
    },
    deleteBook: async (_: any, { id }: { id: number }, context: MyContext) => {
      // Check if user is admin
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new Error('Not authorized')
      }

      context.logger.info('Deleting book', { id })
      const result = await bookRepository.delete(id)
      if (result == null) {
        context.logger.error('Failed to delete book', { id })
        return false
      }
      context.logger.info('Book deleted successfully', { id })
      return result != null && (result.affected as number) > 0
    },
    updateAuthor: async (_: any, { id, name }: { id: number, name: string }) => {
      const author = await authorRepository.findOne({ where: { id } })
      if (!author) throw new Error('Author not found')
      author.name = name
      return await authorRepository.save(author)
    },
    deleteAuthor: async (_: any, { id }: { id: number }) => {
      const result = await authorRepository.delete(id)
      if (result == null) return false
      return result != null && (result.affected as number) > 0
    }
  },
  Book: {
    authors: async (book: Book) =>
      await authorRepository.findBy({ id: In(book.authors.map(author => author.id)) })
  }
}
