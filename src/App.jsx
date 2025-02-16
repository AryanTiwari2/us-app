import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import Home from './pages/Home';
import Cookies from 'universal-cookie';
import { BrowserRouter as Router, Routes, Route,Link } from 'react-router-dom';

function App() {
  const cookies = new Cookies();
  const [isAuthenticated,setIsAuthenticated] = useState(cookies.get('auth-token'));

  return (
    <>
    <Router>
    <Routes>
          <Route path="/us-app" element={<Home isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
        </Routes>
    </Router>
    </>
  )
}

export default App
