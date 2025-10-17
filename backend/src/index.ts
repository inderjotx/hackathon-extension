import { Hono } from 'hono'
import { generateQuestions, generateQuestionsStream } from './ai-core.js'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'
import { stream } from 'hono/streaming'

const app = new Hono()


app.use(
  cors({
    origin: '*',
    allowHeaders: ['*'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['*'],
    maxAge: 600,
    credentials: true,
  })
)

// 30 seconds
app.use(timeout(30_000))

const welcomeStrings = [
  'Hello Hono!',
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})


app.post('/generate-questions', async (c) => {
  const data = await c.req.json() as { pageContent: string }
  const result = await generateQuestions(data.pageContent)
  console.log(result)
  return c.json({ mcqQuestions: result.mcqQuestions })
})

app.post('/generate-questions-stream', async (c) => {
  const data = await c.req.json() as { pageContent: string }

  // Emit NDJSON so the client can progressively parse each completed item

  c.header('Content-Type', 'application/x-ndjson')
  return stream(c, async (stream) => {

    stream.onAbort(() => {
      console.log('Aborted!')
    })

    const partialObjectStream = await generateQuestionsStream(data.pageContent)

    let sentCount = 0
    for await (const partialObject of partialObjectStream) {
      // When the schema is an array, the partial object will grow over time.
      // We only emit newly completed items as individual NDJSON lines.
      if (Array.isArray(partialObject)) {
        while (sentCount < partialObject.length) {
          const item = partialObject[sentCount]
          if (
            item &&
            typeof item.question === 'string' &&
            Array.isArray(item.options) &&
            typeof item.correctOption === 'number' &&
            typeof item.explanation === 'string'
          ) {
            await stream.write(JSON.stringify(item) + '\n')
            sentCount++
          } else {
            break
          }
        }
      } else {
      }
    }
  })

})


export default {
  port: 3000,
  fetch: app.fetch,
  idleTimeout: 60,
}
