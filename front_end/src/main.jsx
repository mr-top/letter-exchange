import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './components/utils/UserContext.jsx';
import { LetterHistoryProvider } from './components/utils/LetterHistoryContext.jsx';
import axios from 'axios';
import { SitePingProvider } from './components/utils/SitePingProvider.jsx';

axios.defaults.withCredentials = true;

const checkIsDarkSchemePreferred = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ?? false;
document.querySelector('html').setAttribute('data-theme', localStorage.getItem('theme') || (checkIsDarkSchemePreferred() ? 'dark' : 'light'));

createRoot(document.getElementById('root')).render(
  <UserProvider>
    <SitePingProvider>
      <LetterHistoryProvider>
        <App />
      </LetterHistoryProvider>
    </SitePingProvider>
  </UserProvider>,
)
