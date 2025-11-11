import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

// URL de tu backend (cambiar por la de Render después)
const API_BASE = "https://proyectobackend-26se.onrender.com";

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  const [prompt, setPrompt] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Configurar axios para incluir el token en las peticiones
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Cargar los posts al montar el componente y cuando se genere uno nuevo
  useEffect(() => {
    if (currentView === 'feed') {
      loadPosts();
    }
  }, [currentView]);

  const loadPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE}/posts`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setMessage('Error al cargar los posts');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/token`, {
        email,
        password
      });
      const { access_token } = response.data;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      setIsLoggedIn(true);
      setMessage('Login exitoso!');
      setCurrentView('generate');
    } catch (error) {
      setMessage('Error en login: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/register`, {
        email,
        password
      });
      setMessage('Registro exitoso! Ahora puedes hacer login.');
      setCurrentView('login');
    } catch (error) {
      setMessage('Error en registro: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
    setCurrentView('login');
    setMessage('Sesión cerrada');
  };

const handleGeneratePost = async (e) => {
  e.preventDefault();
  if (!prompt.trim()) {
    setMessage('Por favor, escribe un prompt para generar el post');
    return;
  }
  setLoading(true);
  try {
    const response = await axios.post(`${API_BASE}/generate-post`, {
      prompt: prompt
    });
    setMessage('Post generado exitosamente!');
    setPrompt('');
    // Recargar los posts
    loadPosts();
    setCurrentView('feed');
  } catch (error) {
    console.error('Error completo:', error);
    console.error('Respuesta del error:', error.response);
    setMessage(`Error al generar post: ${error.response?.data?.detail || error.response?.statusText || error.message}`);
  } finally {
    setLoading(false);
  }
};
  

  return (
    <div className="App">
      <header className="App-header">
        <h1>AI Blog Generator</h1>
        
        {/* Navegación */}
        <nav>
          {isLoggedIn ? (
            <>
              <button onClick={() => setCurrentView('generate')}>Generar Post</button>
              <button onClick={() => setCurrentView('feed')}>Ver Posts</button>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </>
          ) : (
            <>
              <button onClick={() => setCurrentView('login')}>Login</button>
              <button onClick={() => setCurrentView('register')}>Registro</button>
              <button onClick={() => setCurrentView('feed')}>Ver Posts</button>
            </>
          )}
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
            <button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Login'}
            </button>
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
            <button type="submit" disabled={loading}>
              {loading ? 'Cargando...' : 'Registrarse'}
            </button>
          </form>
        )}

        {/* Vista de Generar Post (protegida) */}
        {currentView === 'generate' && isLoggedIn && (
          <form onSubmit={handleGeneratePost}>
            <h2>Generar Post con IA</h2>
            <textarea
              placeholder="Escribe un prompt para generar un post de blog (ej: 'Los beneficios de la inteligencia artificial en la educación')"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="4"
              style={{ width: '100%', padding: '10px', margin: '10px 0' }}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Generando...' : 'Generar Post'}
            </button>
          </form>
        )}

        {/* Vista de Feed público */}
        {currentView === 'feed' && (
          <div>
            <h2>Posts Generados</h2>
            {posts.length === 0 ? (
              <p>No hay posts todavía. ¡Sé el primero en generar uno!</p>
            ) : (
              <div className="posts-container">
                {posts.map(post => (
                  <div key={post.id} className="post">
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                    <small>Publicado el: {new Date(post.created_at).toLocaleDateString()}</small>
                    {post.seo_keywords && (
                      <div>
                        <strong>Palabras clave:</strong> {post.seo_keywords}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mensaje si intenta acceder a generar post sin estar logueado */}
        {currentView === 'generate' && !isLoggedIn && (
          <div>
            <p>Debes iniciar sesión para generar posts.</p>
          </div>
        )}
      </header>
    </div>
  );
}


export default App;