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
import UserList from './components/UserList/UserList';
import FavoritesList from './components/FavoritesList/FavoritesList';
import UpdateProduct from './components/Forms/UpdateProduct/UpdateProduct';
import CategoryList from './components/CategoryList/CategoryList';
import MyReserves from './components/MyReserves/MyReserves';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PagePrincipal />} />
            <Route path="/login" element={<Login />} />
            <Route path="/singup" element={<SignUp />} />
            <Route path="/details/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/FavoritesList" element={<FavoritesList />} />
            <Route path="/MyReserves" element={<MyReserves />} />

            {/* Rutas protegidas solo para ADMIN */}
            <Route path="/CreateProduct" element={
              <ProtectedRoute requiredRole="ADMIN">
                <PropertyForm />
              </ProtectedRoute>
            } />
            <Route path="/ProductList" element={
              <ProtectedRoute requiredRole="ADMIN">
                <ProductList />
              </ProtectedRoute>
            } />
            <Route path="/categories" element={
              <ProtectedRoute requiredRole="ADMIN">
                <CategoryForm />
              </ProtectedRoute>
            } />
            <Route path="/Createfeature" element={
              <ProtectedRoute requiredRole="ADMIN">
                <FeatureForm />
              </ProtectedRoute>
            } />
            <Route path="/FeatureList" element={
              <ProtectedRoute requiredRole="ADMIN">
                <FeaturesList />
              </ProtectedRoute>
            } />
            <Route path="/UserList" element={
              <ProtectedRoute requiredRole="ADMIN">
                <UserList />
              </ProtectedRoute>
            } />
            <Route path="/CategoriesList" element={
              <ProtectedRoute requiredRole="ADMIN">
                <CategoryList />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute requiredRole="ADMIN">
                <UpdateProduct />
              </ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
