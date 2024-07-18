import { Repository } from 'typeorm'
import { Author, Book } from './schema'
import { AppDataSource } from './data-source'

const authorRepository: Repository<Author> = AppDataSource.getRepository(Author)
const bookRepository: Repository<Book> = AppDataSource.getRepository(Book)

export const resolvers = {
  Query: {
    getAuthors: async () =>
      await authorRepository.find({ relations: ['books'] }),
    getAuthor: async (_: any, { id }: { id: number }) =>
      await authorRepository.findOne({ where: { id }, relations: ['books'] }),
    getBooks: async () => await bookRepository.find({ relations: ['author'] }),
    getBook: async (_: any, { id }: { id: number }) =>
      await bookRepository.findOne({ where: { id }, relations: ['author'] }),
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
        yearPublished?: number
        noOfPages?: number
      }
    ) => {
      const query = bookRepository
        .createQueryBuilder('book')
        .leftJoinAndSelect('book.author', 'author')
      if (title)
        query.andWhere('book.title ILIKE :title', { title: `%${title}%` })
      if (authorId) query.andWhere('author.id = :authorId', { authorId })
      if (yearPublished)
        query.andWhere('book.yearPublished = :yearPublished', { yearPublished })
      if (noOfPages)
        query.andWhere('book.noOfPages = :noOfPages', { noOfPages })
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
      }
    ) => {
      const author = await authorRepository.findOne({ where: { id: authorId } })
      if (!author) throw new Error('Author not found')
      // Create a new book entity
      const newBook = bookRepository.create({
        title,
        author,
        yearPublished,
        noOfPages
      })

      // Save the new book entity
      const savedBook = await bookRepository.save(newBook)

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
      }
    ) => {
      const book = await bookRepository.findOne({
        where: { id },
        relations: ['author']
      })
      if (!book) throw new Error('Book not found')
      if (title) book.title = title
      if (authorId) {
        const author = await authorRepository.findOne({
          where: { id: authorId }
        })
        if (!author) throw new Error('Author not found')
        book.author = author
      }
      if (yearPublished !== undefined) book.yearPublished = yearPublished
      if (noOfPages !== undefined) book.noOfPages = noOfPages
      return await bookRepository.save(book)
    },
    deleteBook: async (_: any, { id }: { id: number }) => {
      const result = await bookRepository.delete(id)
      if (result == null) return false
      return result != null && (result.affected as number) > 0
    }
  },
  Book: {
    author: async (book: Book) =>
      await authorRepository.findOne({ where: { id: book.author.id } })
  }
}
