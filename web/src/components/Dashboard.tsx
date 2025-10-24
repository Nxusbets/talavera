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
      setMessage({ type: 'error', text: 'Error al cargar datos' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) {
      setMessage({ type: 'error', text: 'Ingresa un nombre para el proyecto' });
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.post(
        `${API_URL}/api/projects`,
        {
          name: newProjectName,
          description: `Proyecto: ${newProjectName}`
        },
        { headers }
      );

      setProjects([...projects, response.data.data]);
      setNewProjectName('');
      setShowCreateForm(false);
      setMessage({ type: 'success', text: '✅ Proyecto creado exitosamente' });
      setTimeout(() => setMessage(null), 2000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error al crear proyecto';
      setMessage({ type: 'error', text: `❌ ${errorMsg}` });
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      // Primero obtenemos los planes (sin headers de autenticación, es público)
      const plansRes = await axios.get(`${API_URL}/api/plans`);
      console.log('Plans response:', plansRes.data.data);
      
      const proPlan = plansRes.data.data.find((p: any) => p.code === 'pro');
      console.log('Pro plan found:', proPlan);

      if (!proPlan) {
        setMessage({ type: 'error', text: '❌ Plan Pro no encontrado' });
        return;
      }

      // Crear suscripción
      const response = await axios.post(
        `${API_URL}/api/subscriptions/create`,
        {
          planId: proPlan.id
        },
        { headers }
      );

      console.log('Subscription response:', response.data.data);
      
      // Recargar datos completos para obtener el plan asociado
      await loadData();
      
      setMessage({ type: 'success', text: '✅ Actualizado a Plan Pro exitosamente' });
      setTimeout(() => setMessage(null), 2000);
    } catch (error: any) {
      console.error('Error upgrading to Pro:', error);
      const errorMsg = error.response?.data?.error?.message || 'Error al actualizar plan';
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
      return subscription.plan.name_es;
    }
    return 'Gratuito';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="dashboard-info">
            <h2>📊 Dashboard</h2>
            <p className="user-email">Usuario: {email}</p>
          </div>
          <button className="logout-button" onClick={onLogout}>
            🚪 Cerrar Sesión
          </button>
        </div>
        <div className="dashboard-content" style={{ textAlign: 'center', padding: '40px' }}>
          <p>Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-info">
          <h2>📊 Dashboard</h2>
          <p className="user-email">Usuario: {email}</p>
        </div>
        <button className="logout-button" onClick={onLogout}>
          🚪 Cerrar Sesión
        </button>
      </div>

      {message && (
        <div className={`message message-${message.type}`} style={{ margin: '20px 40px 0' }}>
          {message.text}
        </div>
      )}

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h3>📁 Mis Proyectos ({projects.length})</h3>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No tienes proyectos aún.</p>
              {!showCreateForm ? (
                <button 
                  className="create-project-button"
                  onClick={() => setShowCreateForm(true)}
                >
                  ➕ Crear Proyecto
                </button>
              ) : (
                <div className="project-form">
                  <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="project-input"
                  />
                  <div className="form-buttons">
                    <button 
                      className="create-project-button"
                      onClick={handleCreateProject}
                    >
                      Crear
                    </button>
                    <button 
                      className="cancel-button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewProjectName('');
                      }}
                    >
                      Cancelar
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
                  ➕ Crear Proyecto
                </button>
              ) : (
                <div className="project-form" style={{ marginTop: '20px' }}>
                  <input
                    type="text"
                    placeholder="Nombre del proyecto"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="project-input"
                  />
                  <div className="form-buttons">
                    <button 
                      className="create-project-button"
                      onClick={handleCreateProject}
                    >
                      Crear
                    </button>
                    <button 
                      className="cancel-button"
                      onClick={() => {
                        setShowCreateForm(false);
                        setNewProjectName('');
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        <section className="dashboard-section">
          <h3>💳 Mi Suscripción</h3>
          <div className="subscription-info">
            <p>Plan: <strong>{getPlanName()}</strong></p>
            <p>Proyectos disponibles: <strong>{getCurrentQuota()}</strong></p>
            {getPlanName() === 'Gratuito' && (
              <button 
                className="upgrade-button"
                onClick={handleUpgradeToPro}
              >
                ⬆️ Actualizar a Pro
              </button>
            )}
            {getPlanName() === 'Pro' && (
              <p style={{ color: '#27ae60', fontWeight: 'bold' }}>✅ Ya tienes Plan Pro</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
