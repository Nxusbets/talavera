import React, { useState } from 'react';

interface DashboardProps {
  email: string;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ email, onLogout }) => {
  const [projects] = useState<any[]>([]);

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

      <div className="dashboard-content">
        <section className="dashboard-section">
          <h3>📁 Mis Proyectos</h3>
          {projects.length === 0 ? (
            <div className="empty-state">
              <p>No tienes proyectos aún.</p>
              <button className="create-project-button">
                ➕ Crear Proyecto
              </button>
            </div>
          ) : (
            <div className="projects-grid">
              {projects.map((project) => (
                <div key={project.id} className="project-card">
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="dashboard-section">
          <h3>💳 Mi Suscripción</h3>
          <div className="subscription-info">
            <p>Plan: <strong>Gratuito</strong></p>
            <p>Proyectos disponibles: <strong>3</strong></p>
            <button className="upgrade-button">
              ⬆️ Actualizar a Pro
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
