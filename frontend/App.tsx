import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetails from './components/ProductDetails';
import NavBar from './components/NavigationBar';
import HomePage from './components/Homepage';
import React from 'react';
import LoginPage from './components/Login';
import { AuthProvider } from './components/AuthProvider';
import OrderHistory from './components/OrderHistory';
import '/styling/global.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/orderHistory" element={<OrderHistory />}/>
        </Routes>
      </Router>
    </AuthProvider>
    
  );
}

export default App;