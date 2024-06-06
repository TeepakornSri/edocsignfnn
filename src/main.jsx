
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContextProvider from './contexts/AuthContext.jsx'
import 'react-toastify/dist/ReactToastify.css'
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './assets/theme.jsx'
import 'react-toastify/dist/ReactToastify.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </AuthContextProvider>
)
