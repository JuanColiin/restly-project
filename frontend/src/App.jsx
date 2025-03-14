import { Route, Routes } from 'react-router-dom';
import './App.css';
import SignUp from './components/Forms/SingUp/SingUp';
import Header from './components/Header/Header';
import Login from './components/Forms/Login/Login';
import { AuthProvider } from './context/AuthContext'; 
import { PagePrincipal } from './components/Pages/PagePrincipal';
import PropertyForm from './components/Forms/CreateProduct/PropertyForm';
import { Footer } from './components/Footer/Footer';
import ProductList from './components/ProductList/ProductList';
import ProductDetails from './components/ProductDetails/ProductDetails';
import CategoryForm from './components/Forms/CategoryForm/CategoryForm';
import UserProfile from './components/UserProfile/UserProfile';
import FeatureForm from './components/Forms/FeatureForm/FeatureForm';
import FeaturesList from './components/FeaturesList/FeaturesList';

function App() {
  return (
    <AuthProvider>  {/* Envuelve todo con el AuthProvider */}
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PagePrincipal/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/singup" element={<SignUp />} />
            <Route path="/CreateProduct" element={<PropertyForm/>} />
            <Route path="/ProductList" element={<ProductList/>} />
            <Route path="/details/:id" element={<ProductDetails/>} />
            <Route path="/categories" element={<CategoryForm/>} />
            <Route path="/profile" element={<UserProfile/>} />
            <Route path="/Createfeature" element={<FeatureForm/>} />
            <Route path="FeatureList" element={<FeaturesList/>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;