import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import AppRoutes from './App'

export async function render(url: string) {
  const app = (
    <StaticRouter location={url}>
      <AppRoutes />
    </StaticRouter>
  )

  const html = renderToString(app)
  return { html }
}
