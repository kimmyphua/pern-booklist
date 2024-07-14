import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql'
import { gql } from 'apollo-server-express'

@ObjectType()
@Entity()
export class Author {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  name!: string

  @OneToMany(() => Book, (book) => book.author)
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

  @ManyToOne(() => Author, (author) => author.books)
  @JoinColumn() // Ensures that the relationship is correctly mapped in the database
  author!: Author

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
    author: Author!
    yearPublished: Int
    noOfPages: Int
  }

  type Query {
    getAuthors: [Author]
    getAuthor(id: ID!): Author
    getBooks: [Book]
    getBook(id: ID!): Book
    searchBooks(
      title: String
      author: String
      yearPublished: Int
      noOfPages: Int
    ): [Book]
  }

  type Mutation {
    createAuthor(name: String!): Author
    createBook(
      title: String!
      authorId: ID!
      yearPublished: Int
      noOfPages: Int
    ): Book
    updateBook(
      id: ID!
      title: String
      authorId: ID
      yearPublished: Int
      noOfPages: Int
    ): Book
    deleteBook(id: ID!): Boolean
  }
`
