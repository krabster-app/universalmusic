import { Application, Router } from 'oak'
import { searchService } from '$services/search.ts'
import { playService } from './services/play.ts'

const app = new Application()

// Logger
app.use(async (ctx, next) => {
    await next()
    const rt = ctx.response.headers.get('X-Response-Time')
    console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`)
})

// Timing
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.response.headers.set('X-Response-Time', `${ms}ms`)
})

const router = new Router()

router
    .get('/', (context) => {
        context.response.body = 'Universal music backend'
    })
    .get('/search', async (context) => {
        context.response.body = await searchService(context)
    })
    .post('/play', async (context) => {
        context.response.body = await playService(context)
    })

app.use(router.routes())
app.use(router.allowedMethods())

const abortController = new AbortController()

console.log('Listening on port 8000')
app.listen({ port: 8000, signal: abortController.signal })

globalThis.addEventListener('unload', () => abortController.abort())
