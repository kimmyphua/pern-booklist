import { gql } from 'apollo-server-express'
import { Field, ID, ObjectType } from 'type-graphql'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn
} from 'typeorm'

@ObjectType()
@Entity()
export class Author {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @ManyToMany(() => Book, (book) => book.authors)
  books!: Book[]
}

@ObjectType()
@Entity()
export class Book {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  title!: string

  @ManyToMany(() => Author, (author) => author.books)
  @JoinTable({
    name: 'book_authors',
    joinColumn: {
      name: 'book_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'author_id',
      referencedColumnName: 'id'
    }
  })
  @Field(() => [Author])
  authors!: Author[]

  @Field({ nullable: true })
  @Column({ nullable: true })
  yearPublished?: number

  @Field({ nullable: true })
  @Column({ nullable: true })
  noOfPages?: number
}

export const typeDefs = gql`
  type Author {
    id: ID!
    name: String!
    books: [Book]
  }

  type Book {
    id: ID!
    title: String!
    authors: [Author]!
    yearPublished: Int
    noOfPages: Int
  }

  input RangeInput {
    start: Int
    end: Int
  }

  type Query {
    getAuthors: [Author]
    getAuthor(id: ID!): Author
    getBooks: [Book]
    getBook(id: ID!): Book
    searchAuthors(name: String): [Author]
    searchBooks(
      title: String
      authorIds: [ID]
      yearPublished: RangeInput
      noOfPages: RangeInput
    ): [Book]
  }

  type Mutation {
    createAuthor(name: String!): Author
    createBook(
      title: String!
      authorIds: [ID]!
      yearPublished: Int
      noOfPages: Int
    ): Book
    updateBook(
      id: ID!
      title: String
      authorIds: [ID]
      yearPublished: Int
      noOfPages: Int
    ): Book
    updateAuthor(id: ID!, name: String!): Author
    deleteBook(id: ID!): Boolean
    deleteAuthor(id: ID!): Boolean
  }
`
