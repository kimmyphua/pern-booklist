import { Repository } from 'typeorm'
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
      return await bookRepository.find({ relations: ['author'] })
    },
    getBook: async (_: any, { id }: { id: number }, context: MyContext) => {
      context.logger.info('Fetching book by ID', { id })
      return await bookRepository.findOne({ where: { id }, relations: ['author'] })
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
        authorId,
        yearPublished,
        noOfPages
      }: {
        title?: string
        authorId?: number
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
      const query = bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.author', 'author')
      if (title)
        query.andWhere('book.title ILIKE :title', { title: `%${title}%` })
      if (authorId) query.andWhere('author.id = :authorId', { authorId })

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
        authorId,
        yearPublished,
        noOfPages
      }: {
        title: string
        authorId: number
        yearPublished?: number
        noOfPages?: number
      },
      context: MyContext
    ) => {
      // Check authentication
      if (!context.user) {
        throw new Error('Not authenticated')
      }

      context.logger.info('Creating new book', { title, authorId })

      const author = await authorRepository.findOne({ where: { id: authorId } })
      if (!author) {
        context.logger.error('Author not found', { authorId })
        throw new Error('Author not found')
      }

      const newBook = bookRepository.create({
        title,
        author,
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
        authorId,
        yearPublished,
        noOfPages
      }: {
        id: number
        title?: string
        authorId?: number
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
        relations: ['author']
      })
      if (!book) {
        context.logger.error('Book not found', { id })
        throw new Error('Book not found')
      }

      if (title) book.title = title
      if (authorId) {
        const author = await authorRepository.findOne({
          where: { id: authorId }
        })
        if (!author) {
          context.logger.error('Author not found', { authorId })
          throw new Error('Author not found')
        }
        book.author = author
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
    author: async (book: Book) =>
      await authorRepository.findOne({ where: { id: book.author.id } })
  }
}
