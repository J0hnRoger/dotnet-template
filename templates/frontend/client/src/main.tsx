import ReactDOM from 'react-dom/client'
import App from './App.tsx'

import './index.css'
import { healthCheck } from './common/api.ts'

// TODO - if serverCheck fail, we start the mock server
async function enableMocking() {
  const serverUrl = import.meta.env.VITE_BACKEND_URL
  console.log(serverUrl)

  const available = await healthCheck(serverUrl + "/_health")

  if (available || process.env.NODE_ENV !== 'development') {
    return
  }

  console.info("Server is not available, starting mock server")
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

