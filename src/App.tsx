import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { UserAuthProvider } from './context/userAuthContext';
import { CartProvider } from './context/CartContext';
import Home from './components/Home';
import Nav from './components/Nav';
import Foot from './components/Foot';
import AboutUsPage from './components/AboutUsPage';
import ContactPage from './components/ContactPage';
import MenuPage from './components/MenuPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ErrorPage from './components/ErrorPage';
import UserPage from './components/UserPage';
import CheckOutPage from './components/CheckOutPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import DeliveryTimerPage from './components/DeliveryTimerPage';


function App() {
  return (
    <CartProvider>
      <UserAuthProvider>
        <Router>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/sign-up" element={<SignupPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/user-page" element={<UserPage />} />
            <Route path="/check-out" element={<CheckOutPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/delivery-timer" element={<DeliveryTimerPage />} />
            <Route path="/*" element={<ErrorPage />} />
          </Routes>
          <Foot />
        </Router>
      </UserAuthProvider>
    </CartProvider>
  );
}

export default App;