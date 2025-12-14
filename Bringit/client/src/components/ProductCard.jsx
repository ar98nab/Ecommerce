import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`} className="product-card">
      <div >
        <div className="product-image-wrap">
          <img src={product.image} alt={product.name} />
          <div className="product-glow" />
        </div>
        <div className="product-body">
          <h3>{product.name}</h3>
          <p className="product-meta">
            <span>{product.brand}</span> · <span>{product.category}</span>
          </p>
          <p className="product-price">₹{product.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;