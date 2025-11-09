import fs from 'node:fs'
import path from 'node:path'
import express from 'express'
import compression from 'compression'
import sirv from 'sirv'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const isProd = process.argv.includes('--prod')
const resolve = (p) => path.resolve(__dirname, p)

async function createServer() {
  const app = express()

  if (!isProd) {
    const vite = await (await import('vite')).createServer({
      root: __dirname,
      server: { middlewareMode: true },
      appType: 'custom',
    })
    app.use(vite.middlewares)

    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl
        let template = fs.readFileSync(resolve('index.html'), 'utf-8')
        template = await vite.transformIndexHtml(url, template)
        const { render } = await vite.ssrLoadModule('/src/entry-server.tsx')
        const { html } = await render(url)
        const rendered = template.replace('<!--app-html-->', html)
        res.setHeader('Content-Type', 'text/html')
        return res.status(200).end(rendered)
      } catch (e) {
        vite?.ssrFixStacktrace?.(e)
        console.error(e)
        return res.status(500).end('Internal Server Error')
      }
    })
  } else {
    app.use(compression())
    // Serve client assets from dist/assets (default Vite output)
    app.use('/assets', sirv(resolve('dist/assets'), { immutable: true, maxAge: 31536000 }))
    // Serve other static files from dist root (e.g., /vite.svg, /placeholder.svg)
    app.use(sirv(resolve('dist'), { maxAge: 31536000 }))

    app.use('*', async (req, res) => {
      try {
        const url = req.originalUrl
        const template = fs.readFileSync(resolve('dist/index.html'), 'utf-8')
        const { render } = await import(pathToFileURL(resolve('dist/server/entry-server.js')).href)
        const { html } = await render(url)
        const rendered = template.replace('<!--app-html-->', html)
        res.setHeader('Content-Type', 'text/html')
        return res.status(200).end(rendered)
      } catch (e) {
        console.error(e)
        return res.status(500).end('Internal Server Error')
      }
    })
  }

  const port = process.env.PORT || 5173
  app.listen(port, () => {
    console.log(`SSR server running on http://localhost:${port} (${isProd ? 'prod' : 'dev'})`)
  })
}

createServer()
