export async function retryConnection(
  retryCount: number,
  delay: number,
  connectFunction: () => Promise<void>
) {
  for (let i = 0; i < retryCount; i++) {
    try {
      await connectFunction()
      return
    } catch (error) {
      console.log({ error })
      console.log(`Retrying database connection (${i + 1}/${retryCount})...`)
      await new Promise((res) => setTimeout(res, delay))
    }
  }
  throw new Error('Failed to connect to the database after multiple attempts.')
}
