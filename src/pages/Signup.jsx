import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [role, setRole] = useState('patient');
  const [driverDetails, setDriverDetails] = useState({
    licenseNumber: '',
    licenseExpiry: '',
    vehicleRegNumber: '',
    vehicleModel: '',
    vehicleYear: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    vehicleType: 'regular'
  });

  const handleDriverDetailsChange = (e) => {
    const { name, value } = e.target;
    setDriverDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = role === 'patient' ? '/api/auth/signup' : '/api/driver/signup';
      const payload = role === 'patient' 
        ? { name, email, password }
        : {
            name,
            email,
            password,
            ...driverDetails
          };

      const response = await axios.post(endpoint, payload);
    } catch (error) {
    }
  };

  return (
    <div className="signup-container">
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value)}
        className="form-select mb-3"
      >
        <option value="patient">Patient</option>
        <option value="driver">Driver</option>
      </select>

      {role === 'driver' && (
        <div className="driver-details">
          <h3>Driver & Vehicle Details</h3>
          
          <div className="form-group">
            <input
              type="text"
              name="licenseNumber"
              placeholder="Driver License Number"
              value={driverDetails.licenseNumber}
              onChange={handleDriverDetailsChange}
              className="form-control mb-2"
              required
            />
            <input
              type="date"
              name="licenseExpiry"
              placeholder="License Expiry Date"
              value={driverDetails.licenseExpiry}
              onChange={handleDriverDetailsChange}
              className="form-control mb-2"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="vehicleRegNumber"
              placeholder="Vehicle Registration Number"
              value={driverDetails.vehicleRegNumber}
              onChange={handleDriverDetailsChange}
              className="form-control mb-2"
              required
            />
            <input
              type="text"
              name="vehicleModel"
              placeholder="Vehicle Model"
              value={driverDetails.vehicleModel}
              onChange={handleDriverDetailsChange}
              className="form-control mb-2"
              required
            />
            <input
              type="number"
              name="vehicleYear"
              placeholder="Vehicle Year"
              value={driverDetails.vehicleYear}
              onChange={handleDriverDetailsChange}
              className="form-control mb-2"
              required
            />
            <select
              name="vehicleType"
              value={driverDetails.vehicleType}
              onChange={handleDriverDetailsChange}
              className="form-select mb-2"
              required
            >
              <option value="regular">Regular Vehicle</option>
              <option value="wheelchair">Wheelchair Accessible</option>
              <option value="stretcher">Stretcher Equipped</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="text"
              name="insuranceNumber"
              placeholder="Insurance Policy Number"
              value={driverDetails.insuranceNumber}
              onChange={handleDriverDetailsChange}
              className="form-control mb-2"
              required
            />
            <input
              type="date"
              name="insuranceExpiry"
              placeholder="Insurance Expiry Date"
              value={driverDetails.insuranceExpiry}
              onChange={handleDriverDetailsChange}
              className="form-control mb-2"
              required
            />
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Sign up as {role === 'patient' ? 'Patient' : 'Driver'}
      </button>
    </div>
  );
};

export default Signup; 