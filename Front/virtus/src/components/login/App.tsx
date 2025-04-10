import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import '../../styles/App.css';
import logo from '../../assets/logo.png';
import RecuperarContra from './RecupeContra';
import Dashboard from '../dashboard/Dashboard';  // Importamos el Dashboard en lugar de DashboardPage

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [currentView, setCurrentView] = useState('default');
    const navigate = useNavigate();

    useEffect(() => {
        const authenticated = localStorage.getItem('isAuthenticated');
        if (authenticated === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogin = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
    };

    // Función para cambiar entre vistas
    const changeView = (viewName: string) => {
        setCurrentView(viewName);
        // Si estamos cambiando a la vista de todas las notificaciones, redirigir
        if (viewName === 'all_notifications') {
            navigate('/dashboard/notifications');
        }
    };

    return (
        <div className="App">
            <div className="background">
                <div className="dots"></div>
                <div className="stains"></div>
            </div>

            <Routes>
                {/* Ruta para el login */}
                <Route path="/" element={
                    !isAuthenticated ? (
                        <div className="login-container">
                            <img src={logo} className="logo" alt="logo" />
                            <div className="login-form">
                                <input type="text" placeholder="Usuario" />
                                <input type="password" placeholder="Contraseña" />
                                <button onClick={handleLogin}>Ingresar</button>
                                <div className="links">
                                    <a href="/recuperar-contraseña">Olvidó su contraseña?</a>
                                    <a href="#">No tienes usuario? Regístrate</a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Navigate to="/dashboard" /> // Redirige automáticamente al Dashboard si está autenticado
                    )
                }/>

                {/* Ruta para la recuperación de contraseña */}
                <Route path="/recuperar-contraseña" element={<RecuperarContra />} />

                {/* Ruta para el Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? (
                            <Dashboard
                                initialView={currentView}
                                onViewChange={changeView}
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />

                {/* Nueva ruta para la vista de todas las notificaciones */}
                <Route
                    path="/dashboard/notifications"
                    element={
                        isAuthenticated ? (
                            <Dashboard
                                initialView="all_notifications"
                                onViewChange={changeView}
                            />
                        ) : (
                            <Navigate to="/" />
                        )
                    }
                />
            </Routes>
        </div>
    );
}

export default App;