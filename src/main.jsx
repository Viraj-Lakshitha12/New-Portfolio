import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import posthog from 'posthog-js'

if (import.meta.env.VITE_POSTHOG_KEY) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com',
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
