import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useAuth } from '../state/AuthContext';

const AddProductPage = () => {
  const { userInfo } = useAuth();
  const [form, setForm] = useState({
    name: '',
    image: '',
    brand: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const isSeller = userInfo?.role === 'seller' || userInfo?.isAdmin;

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isSeller) {
      setError('Only sellers can add products.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        countInStock: Number(form.countInStock),
      };
      const { data } = await axios.post(
        'http://localhost:5000/api/products',
        payload,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setSuccessMsg(`Product created: ${data.name}`);
      setForm({
        name: '',
        image: '',
        brand: '',
        category: '',
        description: '',
        price: '',
        countInStock: '',
      });
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isSeller) {
    return (
      <section className="page">
        <h1 className="page-title">Add Product</h1>
        <Message variant="danger">
          Only users with the <strong>Seller</strong> role can access this page.
        </Message>
      </section>
    );
  }

  return (
    <section className="page">
      <h1 className="page-title">Add Product</h1>
      <div className="auth-card">
        {error && <Message variant="danger">{error}</Message>}
        {successMsg && <Message variant="success">{successMsg}</Message>}
        {loading && <Loader />}
        <form onSubmit={submitHandler} className="auth-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              value={form.name}
              placeholder="Product name"
              onChange={changeHandler}
              required
            />
          </label>
          <label>
            Image URL
            <input
              type="text"
              name="image"
              value={form.image}
              placeholder="https://..."
              onChange={changeHandler}
              required
            />
          </label>
          <label>
            Brand
            <input
              type="text"
              name="brand"
              value={form.brand}
              placeholder="Brand name"
              onChange={changeHandler}
              required
            />
          </label>
          <label>
            Category
            <input
              type="text"
              name="category"
              value={form.category}
              placeholder="Category (e.g. Sneakers)"
              onChange={changeHandler}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              placeholder="Short description"
              onChange={changeHandler}
              rows={3}
              className="textarea"
              required
            />
          </label>
          <label>
            Price (₹)
            <input
              type="number"
              name="price"
              value={form.price}
              placeholder="0"
              onChange={changeHandler}
              required
            />
          </label>
          <label>
            Count in Stock
            <input
              type="number"
              name="countInStock"
              value={form.countInStock}
              placeholder="0"
              onChange={changeHandler}
              required
            />
          </label>
          <button className="btn-primary w-full" type="submit">
            Save Product
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddProductPage;