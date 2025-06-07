import React, { useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ClientPage.css';

const ClientPage: React.FC = () => {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleClose = () => {
    navigate('/'); // Navigate to the landing page
  };

  return (
    <div className="client-page-container">
      <Navbar />
      <main className="client-page-content">
        <div className="client-form-card">
          <button className="client-close-button" onClick={handleClose}>Close</button>
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
          <div className="date-picker-group">
            <DatePicker
              selected={startDate ?? undefined}
              onChange={setStartDate}
              selectsStart
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              placeholderText="Start Date"
              className="form-input date-input"
              isClearable
            />
            <DatePicker
              selected={endDate ?? undefined}
              onChange={setEndDate}
              selectsEnd
              startDate={startDate ?? undefined}
              endDate={endDate ?? undefined}
              minDate={startDate ?? undefined}
              placeholderText="End Date"
              className="form-input date-input"
              isClearable
            />
          </div>

          <button className="fund-escrow-btn">Fund Escrow</button>
        </div>
      </main>
    </div>
  );
};

export default ClientPage; 