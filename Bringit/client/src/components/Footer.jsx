import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Footer = () => {
  return (
    <footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="brand">
        <a href="/" class="logo">Bringit</a>
        <p class="brand-text">
          Curated home goods and lifestyle products.
          Thoughtfully designed, beautifully crafted.
        </p>
      </div>

      <div>
        <h4 class="footer-title">Shop</h4>
        <ul class="footer-links">
          <li><a href="/">All Products</a></li>
          <li><a href="/?category=Furniture">Furniture</a></li>
          <li><a href="/?category=Decor">Decor</a></li>
          <li><a href="/?category=Lighting">Lighting</a></li>
        </ul>
      </div>
      <div>
        <h4 class="footer-title">Support</h4>
        <ul class="footer-links muted">
          <li>Contact Us</li>
          <li>Shipping & Returns</li>
          <li>FAQ</li>
        </ul>
      </div>

    </div>

    <div class="footer-bottom">
      <p>© 2025 Bringit. All rights reserved.</p>
      <div class="bottom-links">
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </div>
    </div>
  </div>
</footer>

  );
};

export default Footer;