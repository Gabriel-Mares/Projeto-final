import React, { useState } from 'react';
import './RegistrationForm.css';
import { useNavigate } from 'react-router-dom';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    bloodType: '',
    emergencyContact: '',
    allergies: '',
    medications: '',
    illnesses: '',
    surgeries: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/medical-register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      alert(result.message || 'Form submitted!');
      navigate('/profile');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form.');
    }
  };

  return (
    <div className="container">
      <h1>Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="field">
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
            />
          </div>
          <div className="field">
            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="field">
            <label>Blood Type</label>
            <select name="bloodType" value={formData.bloodType} onChange={handleChange}>
              <option value="">Select</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
        </div>

        <div className="field full-width">
          <label>Emergency Contact</label>
          <input
            type="text"
            name="emergencyContact"
            value={formData.emergencyContact}
            onChange={handleChange}
            placeholder="Phone or name"
          />
        </div>

        <div className="field full-width">
          <label>Allergies</label>
          <input
            type="text"
            name="allergies"
            value={formData.allergies}
            onChange={handleChange}
            placeholder="List allergies"
          />
        </div>

        <div className="field full-width">
          <label>Medications Used</label>
          <input
            type="text"
            name="medications"
            value={formData.medications}
            onChange={handleChange}
            placeholder="List medications"
          />
        </div>

        <div className="field full-width">
          <label>Illnesses</label>
          <input
            type="text"
            name="illnesses"
            value={formData.illnesses}
            onChange={handleChange}
            placeholder="List illnesses"
          />
        </div>

        <div className="field full-width">
          <label>Surgeries</label>
          <input
            type="text"
            name="surgeries"
            value={formData.surgeries}
            onChange={handleChange}
            placeholder="List surgeries"
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
