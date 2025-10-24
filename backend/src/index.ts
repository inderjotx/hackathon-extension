import { Hono } from 'hono'
import { Difficulty, generateQuestionsStream } from './ai-core.js'
import { timeout } from 'hono/timeout'
import { cors } from 'hono/cors'
import { stream } from 'hono/streaming'
// import { auth } from './lib/auth.js'
// import { mongoDb } from './lib/db.js'
import { ObjectId } from 'mongodb'

const app = new Hono();

// app.use("*", async (c, next) => {
//   const session = await auth.api.getSession({ headers: c.req.raw.headers });

//   if (!session) {
//     c.set("user", null);
//     c.set("session", null);
//     return next();
//   }

//   c.set("user", session.user);
//   c.set("session", session.session);
//   return next();

// });


app.use(timeout(30_000))

app.use('*', cors({
  origin: (origin) => origin ?? '*',
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}))



// app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.get('/', (c) => {
  return c.text("Hello World")
})


let generateCount = 0
app.post('/generate-questions-stream', async (c) => {

  const data = await c.req.json() as { pageContent: string, numberOfQuestions: number, difficulty: Difficulty }

  const defaultNumberOfQuestions = 10
  const defaultDifficulty = "hard" as Difficulty

  c.header('Content-Type', 'application/x-ndjson')

  generateCount++
  console.log('generateCount', generateCount)
  return stream(c, async (stream) => {

    stream.onAbort(() => {
      console.log('Aborted!')
    })

    const partialObjectStream = await generateQuestionsStream(data.pageContent, data.numberOfQuestions || defaultNumberOfQuestions, data.difficulty || defaultDifficulty)

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


// app.post('/update-configuration', async (c) => {
//   const user = c.get('user') as typeof auth.$Infer.Session.user
//   if (!user || !user.id) {
//     return c.json({ error: 'Unauthorized' }, 401)
//   }

//   const { numberOfQuestions, difficulty } = await c.req.json() as { numberOfQuestions: number, difficulty: Difficulty }
//   const userCollection = mongoDb.collection('users')
//   await userCollection.updateOne({ _id: new ObjectId(user.id) }, { $set: { numberOfQuestions, difficulty } })

//   return c.json({ success: true, user })
// })


export default {
  port: 3000,
  fetch: app.fetch,
  idleTimeout: 60,
}

