import { ApolloServer } from 'apollo-server-express'
import express from 'express'
import 'reflect-metadata'
import { AppDataSource } from './data-source'
import { authMiddleware } from './middleware/auth'
import { createLogger, loggerMiddleware } from './middleware/logger'
import './polyfills'
import { resolvers } from './resolvers'
import { typeDefs } from './schema'
import { MyContext } from './types/context'
import { retryConnection } from './utils/retryConnection'

const startServer = async () => {
  const app = express()

  // Add middlewares
  app.use(loggerMiddleware)
  app.use(authMiddleware)

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }): MyContext => ({
      req,
      res,
      user: req.user,
      logger: createLogger()
    })
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
