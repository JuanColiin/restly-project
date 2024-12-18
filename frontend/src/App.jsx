import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './components/Forms/SingUp/SingUp';
import Header from './components/Header/Header';
import Login from './components/Forms/Login/Login';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider

function App() {
  return (
    <AuthProvider>  {/* Envuelve todo con el AuthProvider */}
      <Header />
      <Routes>
        <Route path="/" element={<h1>Página Principal!</h1>} />
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<SignUp />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

