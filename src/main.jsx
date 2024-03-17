import React from 'react'
import ReactDOM from 'react-dom/client'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import App from './App.jsx'
import theme from './theme'
import CssBaseline from '@mui/material/CssBaseline'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ConfirmProvider } from 'material-ui-confirm'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CssVarsProvider theme={theme}>
      <ConfirmProvider>
        <CssBaseline />
        <App />
        <ToastContainer theme='colored'/>
      </ConfirmProvider>
    </CssVarsProvider>
  </React.StrictMode>
)
