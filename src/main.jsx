
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContextProvider from './contexts/AuthContext.jsx'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './assets/theme.jsx'
import 'react-toastify/dist/ReactToastify.css'
import DocContextProvider from './contexts/DocContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <DocContextProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
    </DocContextProvider>
  </AuthContextProvider>
)
