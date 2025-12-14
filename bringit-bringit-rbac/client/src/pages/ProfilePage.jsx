import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../state/AuthContext';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import Message from '../components/Message';

const ProfilePage = () => {
  const { userInfo } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          'http://localhost:5000/api/auth/profile',
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setProfile(data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userInfo, navigate]);

  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!profile) return null;

  return (
    <section className="page">
      <h1 className="page-title">Your Profile</h1>
      <div className="profile-card">
        <div className="avatar-pill">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <h2>{profile.name}</h2>
        <p>{profile.email}</p>
        <p className="profile-tag">
          Role: <strong>{profile.role}</strong>
        </p>
      </div>
    </section>
  );
};

export default ProfilePage;