import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../state/CartContext';
import { useAuth } from '../state/AuthContext';

const Header = () => {
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const isSeller = userInfo?.role === 'seller' || userInfo?.isAdmin;

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo">
          <span className="logo-pill">Bringit</span>
        </Link>
        <nav className="nav">
          <Link to="/cart" className="nav-link">
            Cart
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </Link>
          {isSeller && (
            <Link to="/add-product" className="nav-link ghost">
              Manage Products
            </Link>
          )}
          {userInfo ? (
            <>
              <button
                className="nav-link ghost"
                onClick={() => navigate('/orders')}
              >
                Orders
              </button>
              <button
                className="nav-link ghost"
                onClick={() => navigate('/profile')}
              >
                {userInfo.name.split(' ')[0]}
              </button>
              <button className="nav-link primary" onClick={logoutHandler}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link primary">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;