import { Route, Routes } from 'react-router-dom'
import './App.css'
import SignUp from './components/Forms/SingUp/SingUp'


import Header from './components/Header/Header'
import Login from './components/Forms/Login/Login'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<h1>Pagina Princpal!</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<SignUp />} />
      </Routes>
      
    </>
  )
}

export default App
