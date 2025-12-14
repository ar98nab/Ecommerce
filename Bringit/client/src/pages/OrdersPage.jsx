import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../state/AuthContext';
import { useCart } from '../state/CartContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrdersPage = () => {
  const { userInfo } = useAuth();
  const { cartItems, clearCart, total } = useCart();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState('');
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const hasCreatedOrder = useRef(false);

  const fetchOrders = async () => {
    if (!userInfo) return;
    try {
      const { data } = await axios.get(
        'http://localhost:5000/api/orders/myorders',
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setOrders(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  const createOrderFromCart = async (paymentMethodFromNav) => {
    if (!userInfo || cartItems.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(
        'http://localhost:5000/api/orders',
        {
          orderItems: cartItems.map((item) => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress: {
            address: '123 Demo Street',
            city: 'Bangalore',
            postalCode: '560001',
            country: 'India',
          },
          paymentMethod: paymentMethodFromNav || 'Cash on Delivery',
          totalPrice: total,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setOrderSuccess(`Order placed successfully (#${data._id.slice(-6)})`);
      clearCart();
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    setCancelError('');
    setCancelSuccess('');
    try {
      const { data } = await axios.patch(
        `http://localhost:5000/api/orders/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setCancelSuccess(`Order #${data._id.slice(-6)} cancelled successfully.`);
      fetchOrders();
    } catch (err) {
      setCancelError(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [userInfo, navigate]);

  useEffect(() => {
    if (location.state?.fromCart && !hasCreatedOrder.current) {
      hasCreatedOrder.current = true;
      const paymentMethod =
        location.state?.paymentMethod || 'Cash on Delivery';
      createOrderFromCart(paymentMethod);
    }
  }, [location.state]);

  if (loadingOrders) return <Loader />;

  return (
    <section className="page">
      <h1 className="page-title">Your Orders</h1>
      {error && <Message variant="danger">{error}</Message>}
      {orderSuccess && <Message variant="success">{orderSuccess}</Message>}
      {cancelError && <Message variant="danger">{cancelError}</Message>}
      {cancelSuccess && <Message variant="success">{cancelSuccess}</Message>}
      {orders.length === 0 ? (
        <p className="empty-state">You have no orders yet.</p>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <p className="order-total">
                Total: ₹{order.totalPrice.toLocaleString()}
              </p>
              <p className="order-payment">
                Payment: <strong>{order.paymentMethod}</strong>
              </p>
              <p className="order-cod-banner">
                Cash on Delivery available. COD text: <strong>Cash on Delivery</strong>
              </p>
              <ul className="order-items">
                {order.orderItems.map((item) => (
                  <li key={item._id}>
                    {item.name} × {item.qty}
                  </li>
                ))}
              </ul>
              {order.isCancelled ? (
                <p className="order-cancelled">Status: Cancelled</p>
              ) : (
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => cancelOrder(order._id)}
                  style={{ marginTop: '8px' }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default OrdersPage;