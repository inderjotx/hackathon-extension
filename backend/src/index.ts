import { Hono } from 'hono'
import { Difficulty, generateQuestions, generateQuestionsStream } from './ai-core.js'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'
import { stream } from 'hono/streaming'
import { auth } from './lib/auth.js'

const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null
  }
}>();

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }

  c.set("user", session.user);
  c.set("session", session.session);
  return next();

});


app.use(timeout(30_000))

app.use('*', cors({
  // Echo back whatever Origin was sent (supports chrome-extension://, http(s)://, etc.)
  origin: (origin) => origin ?? 'null',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}))



// Per-route CORS no longer needed since global CORS above handles credentials and allowed origins

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get('/', (c) => {
  return c.text("Hello World")
})


app.post('/generate-questions', async (c) => {
  const data = await c.req.json() as { pageContent: string, numberOfQuestions: number, difficulty: Difficulty }
  const result = await generateQuestions(data?.pageContent ?? '', data?.numberOfQuestions ?? 10, data?.difficulty ?? Difficulty.EASY)
  return c.json({ mcqQuestions: result.mcqQuestions })
})

app.post('/generate-questions-stream', async (c) => {
  const data = await c.req.json() as { pageContent: string }


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
