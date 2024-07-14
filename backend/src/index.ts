// if (typeof (global as any).Event === 'undefined') {
//   ;(global as any).Event = class {
//     type: string
//     constructor(type: string) {
//       this.type = type
//     }
//   }
// }
import 'reflect-metadata'
import './polyfills'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { AppDataSource } from './data-source'
import { typeDefs } from './schema'
import { resolvers } from './resolvers'
import { retryConnection } from './utils/retryConnection'

const startServer = async () => {
  const app = express()

  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  await server.start()
  server.applyMiddleware({ app })

  await retryConnection(5, 5000, async () => {
    await AppDataSource.initialize()
  })

  app.listen({ port: 4000 }, () => {
    console.log(`Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}

startServer().catch((error) => {
  console.error('Failed to start the server:', error)
})
