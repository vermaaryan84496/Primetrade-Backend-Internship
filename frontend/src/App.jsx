import React, { useState, useEffect } from 'react';

// BASE_URL is just '/api/v1' because vite.config.js handles the http://localhost:8080 part
const BASE_URL = '/api/v1'; 

function App() {
  // State hooks to manage data, forms, and messages
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [message, setMessage] = useState(''); 

  // Load tasks immediately if a token exists in local storage
  useEffect(() => {
    if (token) {
      loadTasks(token);
    }
  }, [token]);
  
  const resetForm = () => {
    setUsername('');
    setPassword('');
  }

  // ------------------------------------------------------------------
  // --- AUTHENTICATION FUNCTIONS (Register, Login, Logout) ---
  // ------------------------------------------------------------------
  async function register() {
    setMessage('');
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const text = await res.text();
        setMessage(res.ok ? `Registration Successful: ${text}` : `Registration Failed: ${text}`);
        resetForm();
    } catch (error) {
        setMessage('Network error during registration.');
    }
  }

  async function login() {
    setMessage('');
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (res.ok) {
            const data = await res.json();
            // Store the token and update UI state
            setToken(data.token);
            localStorage.setItem('token', data.token); 
            await loadTasks(data.token);
            setMessage('Login successful!');
        } else {
            setMessage('Login failed: Invalid credentials.');
            setToken('');
        }
        resetForm();
    } catch (error) {
        setMessage('Network error during login.');
    }
  }
  
  function logout() {
    setToken('');
    setTasks([]);
    localStorage.removeItem('token');
    setMessage('Logged out successfully.');
  }

  // ------------------------------------------------------------------
  // --- TASK CRUD FUNCTIONS (Protected Endpoints) ---
  // ------------------------------------------------------------------

  // READ: Fetch all tasks for the logged-in user
  async function loadTasks(current_token = token) {
    if (!current_token) return;
    setMessage('');
    try {
      const res = await fetch(`${BASE_URL}/tasks`, {
        // Send the JWT in the Authorization header
        headers: { 'Authorization': 'Bearer ' + current_token }
      });
      
      if (res.status === 401 || res.status === 403) {
          setMessage('Session expired or unauthorized. Please log in.');
          setToken('');
          localStorage.removeItem('token');
          return;
      }
      const data = await res.json();
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
        setMessage('Error loading tasks.');
    }
  }

  // CREATE: Send a POST request to create a new task
  async function createTask() {
    setMessage('');
    if (!newTaskTitle.trim()) {
        setMessage('Task title cannot be empty.');
        return;
    }
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token // Protected API requires token
      },
      body: JSON.stringify({ title: newTaskTitle, description: 'Added from frontend UI' })
    });
    
    if (res.ok) {
      setMessage('Task created!');
      setNewTaskTitle('');
      await loadTasks(); // Refresh list
    } else {
      // Handle backend validation errors (HTTP 400)
      const errorBody = await res.json();
      const errorMessage = errorBody.errors ? errorBody.errors.join(', ') : 'Failed to create task.';
      setMessage(`Creation Failed: ${errorMessage}`);
    }
  }

  // DELETE: Send a DELETE request to remove a task
  async function deleteTask(id) {
    setMessage('');
    const res = await fetch(`${BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    });
    
    if (res.status === 204) { // 204 No Content for successful deletion
      setMessage(`Task ${id} deleted.`);
      await loadTasks(); // Refresh list
    } else {
      setMessage(`Deletion failed (Status: ${res.status}).`);
    }
  }

  // ------------------------------------------------------------------
  // --- RENDER UI ---
  // ------------------------------------------------------------------
  return (
    <div style={{ padding: 20, maxWidth: 600, margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Primetrade Task App Demo</h1>
      <p style={{ color: 'red', minHeight: '1.2em' }}>{message}</p>

      {/* --- AUTH SECTION --- */}
      {!token ? (
        <div style={{ border: '1px solid #ccc', padding: 15, marginBottom: 20 }}>
          <h2>Authentication</h2>
          <input 
            placeholder="Username" 
            value={username}
            onChange={e => setUsername(e.target.value)} 
            style={{ marginRight: 10, padding: 5, border: '1px solid #ddd' }}
          />
          <input 
            placeholder="Password" 
            type="password" 
            value={password}
            onChange={e => setPassword(e.target.value)} 
            style={{ marginRight: 10, padding: 5, border: '1px solid #ddd' }}
          />
          <button onClick={register} style={{ padding: '8px 12px' }}>Register</button>
          <button onClick={login} style={{ padding: '8px 12px', marginLeft: 5 }}>Login</button>
        </div>
      ) : (
        <div style={{ border: '1px solid #007bff', padding: 15, marginBottom: 20, backgroundColor: '#e9f7ff' }}>
          <h2>Protected Dashboard</h2>
          <button onClick={logout} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none' }}>Logout</button>
        </div>
      )}

      {/* --- TASKS SECTION: Visible only if logged in --- */}
      {token && (
        <div>
          <h3>Your Tasks ({tasks.length})</h3>
          
          <div style={{ marginBottom: 20 }}>
            <input 
              placeholder="New Task Title" 
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)} 
              style={{ padding: 5, width: 250, marginRight: 10, border: '1px solid #ddd' }}
            />
            <button onClick={createTask} style={{ padding: '8px 12px' }}>Add Task</button>
            <button onClick={() => loadTasks()} style={{ padding: '8px 12px', marginLeft: 10 }}>Refresh List</button>
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {tasks.map(t => (
              <li key={t.id} style={{ borderBottom: '1px dashed #eee', padding: '10px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>
                  <strong>{t.title}</strong> 
                  <small style={{ display: 'block', color: '#666', fontSize: '0.8em' }}>ID: {t.id} | Status: {t.completed ? 'Completed ✅' : 'Pending ❌'}</small>
                </span>
                <button 
                  onClick={() => deleteTask(t.id)} 
                  style={{ backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', padding: '5px 10px' }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;