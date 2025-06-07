import React from 'react';
import Navbar from './Navbar';
import './ClientPage.css';

const ClientPage: React.FC = () => {
  return (
    <div className="client-page-container">
      <Navbar />
      <main className="client-page-content">
        <div className="client-form-card">
          <input type="text" placeholder="Project Title" className="form-input" />
          <input type="text" placeholder="Full Project Budget" className="form-input" />
          <textarea placeholder="Detailed Project Description" className="form-textarea"></textarea>

          <h3 className="section-title">Milestones</h3>
          <div className="milestone-group">
            <input type="text" placeholder="Milestone 1 Title" className="form-input milestone-input" />
            <input type="text" placeholder="Payout" className="form-input payout-input" />
          </div>
          <div className="milestone-group">
            <input type="text" placeholder="Milestone 2 Title" className="form-input milestone-input" />
            <input type="text" placeholder="Payout" className="form-input payout-input" />
          </div>
          <div className="milestone-group">
            <input type="text" placeholder="Milestone 3 Title" className="form-input milestone-input" />
            <input type="text" placeholder="Payout" className="form-input payout-input" />
          </div>

          <h3 className="section-title">Project Timeline</h3>
          <input type="text" placeholder="dd/mm/yy" className="form-input" />

          <button className="fund-escrow-btn">Fund Escrow</button>
        </div>
      </main>
    </div>
  );
};

export default ClientPage; 