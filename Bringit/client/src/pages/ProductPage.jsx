import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useCart } from '../state/CartContext';
import { useAuth } from '../state/AuthContext';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');

  const isSeller = userInfo?.role === 'seller' || userInfo?.isAdmin;

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `https://bringit-0vs9.onrender.com/api/products/${id}`
      );
      setProduct(data);
      if (data.countInStock < qty) {
        setQty(data.countInStock > 0 ? 1 : 0);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if (product) {
      addToCart(product, qty);
      navigate('/cart');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: name === 'price' || name === 'countInStock' ? Number(value) : value }));
  };

  const saveChanges = async () => {
    if (!isSeller) return;
    setSaving(true);
    setSaveError('');
    setSaveMsg('');
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/products/${id}`,
        {
          name: product.name,
          image: product.image,
          brand: product.brand,
          category: product.category,
          description: product.description,
          price: product.price,
          countInStock: product.countInStock,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setProduct(data);
      setSaveMsg('Product updated successfully.');
      setEditMode(false);
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async () => {
    if (!isSeller) return;
    if (!window.confirm('Remove this product permanently?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      navigate('/');
    } catch (err) {
      setSaveError(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!product) return null;

  return (
    <section className="page product-page">
      <div className="product-layout">
        <div className="product-visual">
          <div className="product-visual-card">
            <img src={product.image} alt={product.name} />
          </div>
        </div>
        <div className="product-details">
          <p className="pill pill-soft">{product.brand}</p>
          {saveMsg && <Message variant="success">{saveMsg}</Message>}
          {saveError && <Message variant="danger">{saveError}</Message>}
          {editMode ? (
            <>
              <input
                className="auth-form input"
                style={{ marginBottom: '6px' }}
                name="name"
                value={product.name}
                onChange={handleEditChange}
              />
              <textarea
                className="textarea"
                name="description"
                value={product.description}
                onChange={handleEditChange}
                rows={3}
                style={{ marginBottom: '6px' }}
              />
            </>
          ) : (
            <>
              <h1>{product.name}</h1>
              <p className="product-desc">{product.description}</p>
            </>
          )}
          <p className="product-meta">
            <span>{product.category}</span> ·{' '}
            <span>
              {product.countInStock > 0
                ? `${product.countInStock} in stock`
                : 'Out of Stock'}
            </span>
          </p>
          <p className="product-price-lg">
            ₹{product.price.toLocaleString()}
          </p>

          {product.countInStock > 0 && (
            <div className="product-actions">
              <label className="qty-label">
                Qty
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </label>
              <button className="btn-primary" onClick={addToCartHandler}>
                Add to Cart
              </button>
            </div>
          )}

          {isSeller && (
            <div style={{ marginTop: '14px', display: 'flex', gap: '8px' }}>
              <button
                className="btn-secondary"
                type="button"
                onClick={() => setEditMode((prev) => !prev)}
              >
                {editMode ? 'Cancel Edit' : 'Edit Product'}
              </button>
              {editMode && (
                <button
                  className="btn-primary"
                  type="button"
                  onClick={saveChanges}
                  disabled={saving}
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              )}
              <button
                className="btn-secondary"
                type="button"
                onClick={deleteProduct}
              >
                Remove Product
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductPage;