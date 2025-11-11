import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

// URL de tu backend (cambiar por la de Render después)
const API_BASE = "http://localhost:8000";

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Procesando login...');
    // Aquí implementaremos la autenticación
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Procesando registro...');
    // Aquí implementaremos el registro
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Blog Generator</h1>
        
        {/* Navegación */}
        <nav>
          <button onClick={() => setCurrentView('login')}>Login</button>
          <button onClick={() => setCurrentView('register')}>Registro</button>
          <button onClick={() => setCurrentView('generate')}>Generar Post</button>
          <button onClick={() => setCurrentView('feed')}>Ver Posts</button>
        </nav>

        {/* Mensajes */}
        {message && <div className="message">{message}</div>}

        {/* Formulario de Login */}
        {currentView === 'login' && (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        )}

        {/* Formulario de Registro */}
        {currentView === 'register' && (
          <form onSubmit={handleRegister}>
            <h2>Registro</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Registrarse</button>
          </form>
        )}

        {/* Vista de Generar Post (protegida) */}
        {currentView === 'generate' && (
          <div>
            <h2>Generar Post con IA</h2>
            <p>Esta funcionalidad requiere estar logueado</p>
          </div>
        )}

        {/* Vista de Feed público */}
        {currentView === 'feed' && (
          <div>
            <h2>Posts Generados</h2>
            <p>Aquí se mostrarán los posts públicos</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;