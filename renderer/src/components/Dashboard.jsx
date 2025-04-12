import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { FaPlusCircle, FaSearch, FaSun, FaMoon } from 'react-icons/fa';
import { ThemeContext } from '../App';
import { useCallback } from 'react';
import Particles from '@tsparticles/react'; // Updated import for the latest version
import { loadSlim } from '@tsparticles/slim';

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div>
      {/* Particle Background */}
      <Particles
        className="particles"
        init={particlesInit}
        options={{
          particles: {
            number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: theme === 'light' ? '#FFB6C1' : '#FF8A9B' },
            shape: { type: 'circle' },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            move: { enable: true, speed: 1, direction: 'none', random: true, out_mode: 'out' },
          },
          interactivity: {
            events: { onHover: { enable: true, mode: 'repulse' } },
            modes: { repulse: { distance: 100, duration: 0.4 } },
          },
        }}
      />

      {/* Header */}
      <header className="header">
        <h1>Product Creation Dashboard</h1>
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? <FaMoon /> : <FaSun />}
          </button>
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <div className="main-content">
        <h1>🌸 Welcome to Your Product Dashboard! 🌿</h1>
        <p className="subtitle">Let’s create and track your product requests with ease.</p>

        {/* Button Grid */}
        <div className="button-grid">
          <div className="button-card" onClick={() => navigate('/submit-request')}>
            <FaPlusCircle className="button-icon" />
            <h3>Submit SKU Request</h3>
            <p>Add a new product to the system by filling out a simple form.</p>
          </div>
          <div className="button-card" onClick={() => navigate('/check-status')}>
            <FaSearch className="button-icon" />
            <h3>Check on Status</h3>
            <p>View the status of your submitted product requests.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        Made with 🌟 | Last Update: 4/10/2025
      </footer>
    </div>
  );
};

export default Dashboard;