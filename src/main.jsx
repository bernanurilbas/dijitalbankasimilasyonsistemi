import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './store/index.js'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'dark');
}

if (localStorage.getItem('theme') === 'dark' || !('theme' in localStorage)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}