import React, { useState } from 'react';
import './SignupModal.css';

type SignupModalProps = {
  open: boolean;
  onClose: () => void;
  onSignupComplete?: (role: 'freelancer' | 'client') => void;
};

const SignupModal: React.FC<SignupModalProps> = ({ open, onClose, onSignupComplete }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'freelancer' | 'client' | ''>('');

  if (!open) return null;

  const handleContinue = () => {
    if (email && role && onSignupComplete) {
      onSignupComplete(role);
    }
  };

  return (
    <div className="signup-modal-overlay">
      <div className="signup-modal-card">
        <button className="signup-modal-close" onClick={onClose}>&times;</button>
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
        <button className="signup-continue" disabled={!email || !role} onClick={handleContinue}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default SignupModal; 