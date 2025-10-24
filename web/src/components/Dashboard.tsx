import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardProps {
  email: string;
  onLogout: () => void;
}

interface Project {
  id: number;
  name: string;
  description: string;
}

interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  plan?: {
    id: number;
    code: string;
    name_en: string;
    name_es: string;
    projects_quota: number;
    price: string;
  };
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const Dashboard: React.FC<DashboardProps> = ({ email, onLogout }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [newProjectName, setNewProjectName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };

      // Cargar proyectos
      const projectsRes = await axios.get(`${API_URL}/api/projects`, { headers });
      setProjects(projectsRes.data.data || []);

      // Cargar suscripción actual
      try {
        const subRes = await axios.get(`${API_URL}/api/subscriptions/current`, { headers });
        setSubscription(subRes.data.data);
      } catch (err) {
        // Si no tiene suscripción, eso es normal
        setSubscription(null);
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      setMessage({ type: 'error', text: 'Error loading data' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setMessage({ type: 'error', text: 'Please enter a project name' });
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_URL}/api/projects`,
        {
          name: newProjectName,
          description: `Project: ${newProjectName}`
        },
        { headers }
      );

      setProjects([...projects, response.data.data]);
      setNewProjectName('');
      setShowCreateForm(false);
      setMessage({ type: 'success', text: '✅ Project created successfully' });
      setTimeout(() => setMessage(null), 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error creating project';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Get plans (no auth headers needed, it's public)
      const plansRes = await axios.get(`${API_URL}/api/plans`);
      console.log('Plans response:', plansRes.data.data);
      
      const proPlan = plansRes.data.data.find((p: any) => p.code === 'pro');
      console.log('Pro plan found:', proPlan);

      if (!proPlan) {
        setMessage({ type: 'error', text: '❌ Pro plan not found' });
        return;
      }

      // Create subscription
      const response = await axios.post(
        `${API_URL}/api/subscriptions/create`,
        {
          planId: proPlan.id
        },
        { headers }
      );

      console.log('Subscription response:', response.data.data);
      
      // Reload data to get updated plan info
      await loadData();
      
      setMessage({ type: 'success', text: '✅ Successfully upgraded to Pro Plan' });
      setTimeout(() => setMessage(null), 2000);
    } catch (error: any) {
      console.error('Error upgrading to Pro:', error);
      const errorMsg = error.response?.data?.error?.message || 'Error upgrading plan';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    }
  };

  const getCurrentQuota = () => {
    if (subscription?.plan?.projects_quota) {
      return subscription.plan.projects_quota;
    }
    return 3; // Free plan default
  };

  const getPlanName = () => {
    if (subscription?.plan?.name_es) {
      // Map Spanish names to English
      if (subscription.plan.name_es === 'Gratis') return 'Free';
      if (subscription.plan.name_es === 'Profesional') return 'Professional';
      return subscription.plan.name_es;
    }
    return 'Free';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="dashboard-info">
            <h2>📊 Dashboard</h2>
            <p className="user-email">User: {email}</p>
          </div>
          <button className="logout-button" onClick={onLogout}>
            🚪 Sign Out
          </button>
        </div>
        <div className="dashboard-content" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-info">
          <h2>📊 Dashboard</h2>
          <p className="user-email">User: {email}</p>
        </div>
        <button className="logout-button" onClick={onLogout}>
          🚪 Sign Out
        </button>
      </div>

      {message && (
        <div className={`message message-${message.type}`} style={{ margin: '20px 40px 0' }}>
          {message.text}
        </div>
      )}

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h3>📁 My Projects ({projects.length})</h3>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>You don't have any projects yet.</p>
              {!showCreateForm ? (
                <button 
                  className="create-project-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  ➕ Create Project
                </button>
              ) : (
                <div className="project-form">
                  <input
                    type="text"
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="project-input"
                  />
                  <div className="form-buttons">
                    <button 
                      className="create-project-button"
                      onClick={handleCreateProject}
                    >
                      Create
                    </button>
                    <button 
                      className="cancel-button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewProjectName('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="project-card">
                    <h4>{project.name}</h4>
                    <p>{project.description}</p>
                  </div>
                ))}
              </div>
              {!showCreateForm ? (
                <button 
                  className="create-project-button"
                  onClick={() => setShowCreateForm(true)}
                  style={{ marginTop: '20px' }}
                >
                  ➕ Create Project
                </button>
              ) : (
                <div className="project-form" style={{ marginTop: '20px' }}>
                  <input
                    type="text"
                    placeholder="Project name"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="project-input"
                  />
                  <div className="form-buttons">
                    <button 
                      className="create-project-button"
                      onClick={handleCreateProject}
                    >
                      Create
                    </button>
                    <button 
                      className="cancel-button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewProjectName('');
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <section className="dashboard-section">
          <h3>💳 My Subscription</h3>
          <div className="subscription-info">
            <p>Plan: <strong>{getPlanName()}</strong></p>
            <p>Available Projects: <strong>{getCurrentQuota()}</strong></p>
            {getPlanName() === 'Free' && (
              <button 
                className="upgrade-button"
                onClick={handleUpgradeToPro}
              >
                ⬆️ Upgrade to Pro
              </button>
            )}
            {getPlanName() === 'Professional' && (
              <p style={{ color: '#27ae60', fontWeight: 'bold' }}>✅ You already have Pro Plan</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
