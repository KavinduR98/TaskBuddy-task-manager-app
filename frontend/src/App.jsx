import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      <Route path="/" element={<Login />} />
    </Routes>
  )
}

export default App
