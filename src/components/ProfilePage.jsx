import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; // Alterado para QRCodeCanvas
import axios from 'axios';
import './ProfilePage.css';

import './ProfilePage.css';

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleGenerateQR = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/qr-data', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Convertendo os dados para string JSON para o QR Code
      const qrDataString = JSON.stringify(response.data);
      setShowQR(qrDataString);
    } catch (err) {
      console.error('Error generating QR data:', err);
      setError('Failed to generate QR code');
    }
  };

  const handleLogout = () => {
    // Remove o token do localStorage
    localStorage.removeItem('token');
    // Redireciona para a página de login
    navigate('/login');
  };

  const handleDownloadQR = () => {
    if (!qrCodeRef.current) return;

    const canvas = qrCodeRef.current.querySelector('canvas');
    if (!canvas) return;

    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "medical-qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <div className="profile-container loading">Loading...</div>;
  }

  if (error) {
    return <div className="profile-container error">{error}</div>;
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Your Profile</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <section className="profile-section">
        <h2>Personal Information</h2>
        {profile?.user && (
          <div className="info-grid">
            <div className="info-item">
              <strong>Username:</strong> {profile.user.username}
            </div>
            <div className="info-item">
              <strong>Email:</strong> {profile.user.email}
            </div>
          </div>
        )}
      </section>

      <section className="profile-section">
        <h2>Medical Information</h2>
        {profile?.medicalData ? (
          <div className="info-grid">
            <div className="info-item">
              <strong>First Name:</strong> {profile.medicalData.firstName || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Last Name:</strong> {profile.medicalData.lastName || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Gender:</strong> {profile.medicalData.gender || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Blood Type:</strong> {profile.medicalData.bloodType || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Emergency Contact:</strong> {profile.medicalData.emergencyContact || 'Not provided'}
            </div>
            <div className="info-item">
              <strong>Allergies:</strong> {profile.medicalData.allergies || 'None'}
            </div>
            <div className="info-item">
              <strong>Medications:</strong> {profile.medicalData.medications || 'None'}
            </div>
            <div className="info-item">
              <strong>Illnesses:</strong> {profile.medicalData.illnesses || 'None'}
            </div>
            <div className="info-item">
              <strong>Surgeries:</strong> {profile.medicalData.surgeries || 'None'}
            </div>
          </div>
        ) : (
          <div className="no-medical-info">
            <p>No medical information registered yet.</p>
            <button 
              onClick={() => navigate('/medical-registration')}
              className="add-medical-info-button"
            >
              Add Medical Information
            </button>
          </div>
        )}
      </section>

      <div className="qr-section">
        <button 
          onClick={handleGenerateQR} 
          className={`qr-button ${showQR ? 'active' : ''}`}
        >
          {showQR ? 'Hide QR Code' : 'Generate Medical QR Code'}
        </button>
        
        {showQR && (
      <div className="qr-container" ref={qrCodeRef}>
        <QRCodeCanvas 
          value={showQR} 
          size={256}
          level="H"
          includeMargin={true}
        />
        <button 
          onClick={handleDownloadQR}
          className="download-qr-button"
        >
          Download QR Code
        </button>
        <p className="qr-note">
          This QR code contains all your medical information. Share it with healthcare professionals when needed.
        </p>
      </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;