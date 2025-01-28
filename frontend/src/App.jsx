import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './components/Forms/SingUp/SingUp';
import Header from './components/Header/Header';
import Login from './components/Forms/Login/Login';
import { AuthProvider } from './context/AuthContext'; // Importa el AuthProvider
import { PagePrincipal } from './components/Pages/PagePrincipal';
import PropertyForm from './components/Forms/CreateProduct/PropertyForm';
import { Footer } from './components/Footer/Footer';

function App() {
  return (
    <AuthProvider>  {/* Envuelve todo con el AuthProvider */}
      <Header />
      <Routes>
        <Route path="/" element={<PagePrincipal/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/singup" element={<SignUp />} />
        <Route path="/CreateProduct" element={<PropertyForm/>} />
      </Routes>

      <Footer />
    </AuthProvider>
  );
}

export default App;

