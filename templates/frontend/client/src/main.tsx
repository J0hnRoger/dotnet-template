import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import './index.css'

// TODO - if serverCheck fail, we start the mock server
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { worker } = await import('../mocks/browser.ts')

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start()
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <App />
  )
})

