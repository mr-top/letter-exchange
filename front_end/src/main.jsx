import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './components/utils/UserContext.jsx';
import { LetterHistoryProvider } from './components/utils/LetterHistoryContext.jsx';
import axios from 'axios';

axios.defaults.withCredentials = true;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <LetterHistoryProvider>
        <App />
      </LetterHistoryProvider>
    </UserProvider>
  </StrictMode>,
)
