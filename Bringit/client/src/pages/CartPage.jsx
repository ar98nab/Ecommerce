import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../state/CartContext';
import { useAuth } from '../state/AuthContext';
import Message from '../components/Message';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQty, total } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const [rzpError, setRzpError] = useState('');
  const [rzpLoading, setRzpLoading] = useState(false);

  const checkoutCODHandler = () => {
    if (!userInfo) {
      navigate('/login');
    } else {
      navigate('/orders', {
        state: { fromCart: true, paymentMethod: 'Cash on Delivery' },
      });
    }
  };

  const loadScript = (src) =>
    new Promise((resolve) => {
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        return resolve(true);
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const checkoutRazorpayHandler = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) return;

    setRzpError('');
    setRzpLoading(true);

    const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!ok) {
      setRzpError('Failed to load Razorpay SDK. Check your internet connection.');
      setRzpLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        'https://bringit-0vs9.onrender.com/api/payment/razorpay-order',
        {
          amount: total,
        }
      );

      const { order, key } = data;

      const options = {
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'Bringit',
        description: 'Order payment',
        order_id: order.id,
        handler: function () {
          navigate('/orders', {
            state: { fromCart: true, paymentMethod: 'Razorpay' },
          });
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: '#1f2933',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setRzpError(err.response?.data?.message || err.message);
    } finally {
      setRzpLoading(false);
    }
  };

  return (
    <section className="page">
      <h1 className="page-title">Your Bag</h1>
      {rzpError && <Message variant="danger">{rzpError}</Message>}
      {cartItems.length === 0 ? (
        <p className="empty-state">Your bag is currently empty.</p>
      ) : (
        <div className="cart-layout">
          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="cart-thumb">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-meta">
                  <h3>{item.name}</h3>
                  <p>₹{item.price.toLocaleString()}</p>
                </div>
                <div className="cart-actions">
                  <select
                    value={item.qty}
                    onChange={(e) =>
                      updateQty(item._id, Number(e.target.value))
                    }
                  >
                    {[...Array(10).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="ghost-link"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <p>
              Items: <strong>{cartItems.length}</strong>
            </p>
            <p>
              Total:{' '}
              <strong>₹{total.toLocaleString()}</strong>
            </p>
            <div className="payment-options">
              <button className="btn-primary w-full" onClick={checkoutCODHandler}>
                Cash on Delivery
              </button>
              <button
                className="btn-secondary w-full"
                onClick={checkoutRazorpayHandler}
                disabled={rzpLoading}
              >
                {rzpLoading ? 'Opening Razorpay…' : 'Pay with Razorpay'}
              </button>
            </div>
            <p className="cart-note">
              Choose <strong>Cash on Delivery</strong> or pay securely using{' '}
              <strong>Razorpay</strong>.
            </p>
          </aside>
        </div>
      )}
    </section>
  );
};

export default CartPage;