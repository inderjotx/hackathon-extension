import { Hono } from 'hono'
import { generateQuestions } from './ai-core'
const app = new Hono()


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

export default app
