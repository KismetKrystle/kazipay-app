import React, { useState } from 'react';
import './Signup.css';
import Navbar from './Navbar';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  return (
    <div className="signup-bg">
      <Navbar onSignupClick={() => {}} />
      <div className="signup-center">
        <div className="signup-card">
          <h2>Welcome to KAZI PAY</h2>
          <p className="signup-sub">Login or Signup to get started</p>
          <input
            className="signup-input"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div className="signup-roles">
            <label>
              <input
                type="radio"
                name="role"
                value="freelancer"
                checked={role === 'freelancer'}
                onChange={() => setRole('freelancer')}
              /> Freelancer
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="client"
                checked={role === 'client'}
                onChange={() => setRole('client')}
              /> Client
            </label>
          </div>
          <button className="signup-continue" disabled={!email || !role}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup; 