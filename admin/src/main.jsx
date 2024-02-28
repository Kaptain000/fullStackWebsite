import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// import BrowserRouter
import { BrowserRouter } from "react-router-dom"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* move <App /> in <BrowserRouter> to make react router dom effective in whole project  */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
