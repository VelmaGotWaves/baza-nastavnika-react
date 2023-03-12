import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// import './index.css'
import './styles/index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  

    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>

  
)
// strict mode disejblovan i reseni neki problemi 