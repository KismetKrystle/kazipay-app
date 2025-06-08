import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import { EscrowContract } from '../utils/escrowContract';
import './ClientPage.css';

interface Milestone {
  title: string;
  amount: string;
}

interface ProjectData {
  title: string;
  budget: string;
  description: string;
  milestones: Milestone[];
  timeline: string;
}

const ClientPage: React.FC = () => {
  const { wallet, isConnected, connectWallet } = useWallet();
  const navigate = useNavigate();
  const [projectData, setProjectData] = useState<ProjectData>({
    title: '',
    budget: '',
    description: '',
    milestones: [{ title: '', amount: '' }],
    timeline: ''
  });
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [escrowContract] = useState(() => new EscrowContract());

  const handleClose = () => {
    navigate('/');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
    setProjectData(prev => {
      const newMilestones = [...prev.milestones];
      newMilestones[index] = {
        ...newMilestones[index],
        [field]: value
      };
      return {
        ...prev,
        milestones: newMilestones
      };
    });
  };

  const addMilestone = () => {
    setProjectData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { title: '', amount: '' }]
    }));
  };

  const removeMilestone = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    // Check if all required fields are filled
    if (!projectData.title || !projectData.budget || !projectData.description || !projectData.timeline) {
      setError('Please fill in all required fields');
      return false;
    }

    // Validate budget and payouts are numbers
    if (isNaN(Number(projectData.budget))) {
      setError('Budget must be a valid number');
      return false;
    }

    // Check if all milestone amounts are valid numbers
    const invalidMilestone = projectData.milestones.find(
      milestone => !milestone.title || !milestone.amount || isNaN(Number(milestone.amount))
    );
    if (invalidMilestone) {
      setError('All milestone amounts must be valid numbers');
      return false;
    }

    // Check if total milestone payouts match project budget
    const totalPayouts = projectData.milestones.reduce(
      (sum, milestone) => sum + Number(milestone.amount),
      0
    );
    if (totalPayouts !== Number(projectData.budget)) {
      setError('Total milestone payouts must match project budget');
      return false;
    }

    // Check if wallet is connected
    if (!isConnected || !wallet) {
      setError('Please connect your wallet first');
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    alert('Please run node sendPayment.js in your terminal to complete the transaction.');
  };

  return (
    <div className="client-page">
      <div className="client-container">
        <h1>Create New Project</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Project Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={projectData.title}
              onChange={handleInputChange}
              placeholder="Enter project title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="budget">Project Budget (XRP)</label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={projectData.budget}
              onChange={handleInputChange}
              placeholder="Enter budget in XRP"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description</label>
            <textarea
              id="description"
              name="description"
              value={projectData.description}
              onChange={handleInputChange}
              placeholder="Describe your project requirements"
              required
            />
          </div>

          <div className="form-group">
            <label>Project Timeline</label>
            <input
              type="text"
              name="timeline"
              value={projectData.timeline}
              onChange={handleInputChange}
              placeholder="DD/MM/YY"
              required
            />
          </div>

          <div className="form-group">
            <label>Milestones</label>
            {projectData.milestones.map((milestone, index) => (
              <div key={index} className="milestone-inputs">
                <input
                  type="text"
                  value={milestone.title}
                  onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                  placeholder="Milestone title"
                  required
                />
                <input
                  type="number"
                  value={milestone.amount}
                  onChange={(e) => handleMilestoneChange(index, 'amount', e.target.value)}
                  placeholder="Amount in XRP"
                  required
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="remove-milestone"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addMilestone} className="add-milestone">
              Add Milestone
            </button>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            Fund Escrow
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClientPage; 