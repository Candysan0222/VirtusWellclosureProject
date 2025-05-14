import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PaginaPrincipal from './PaginaPrincipal';
import FormatoGrid from '../Formatos/FormatoGrid';
import Ambi from '../Formatos/Ambi'; // Importar tu componente Ambi
import './Dashboard.css';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

// Agregamos esta hoja de estilo para contener los estilos de Ambi
// import './AmbiContainer.css';

interface DashboardProps {
    initialView?: string;
    onViewChange?: (viewName: string) => void;
    formatoId?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ initialView = 'default', onViewChange, formatoId }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentView, setCurrentView] = useState(initialView);
    const [iframeUrl, setIframeUrl] = useState('');
    const [iframeKey, setIframeKey] = useState(0);
    const [currentFormatoId, setCurrentFormatoId] = useState<string | null>(formatoId || null);

    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    // Extraer formatoId de la URL si existe
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        if (pathParts.length > 2 && pathParts[1] === 'formato') {
            setCurrentFormatoId(pathParts[2]);
            setCurrentView('formatos'); // Cambiar vista a formatos para mostrar contenido específico
        } else if (location.pathname.includes('/dashboard/formatos')) {
            setCurrentView('formatos');
            setCurrentFormatoId(null); // Reset formato específico si estamos en la vista general
        }
    }, [location]);

    // Actualizar la vista cuando cambia initialView
    useEffect(() => {
        if (initialView) {
            setCurrentView(initialView);
        }
    }, [initialView]);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const changeView = (viewName: string) => {
        setCurrentView(viewName);

        // Caso especial para la vista de formatos
        if (viewName === 'formatos') {
            setCurrentFormatoId(null); // Reset formato específico al cambiar a vista general
            // Si estamos usando React Router, podemos navegar programáticamente
            navigate('/dashboard/formatos');
            return; // No necesitamos iframe para esta vista
        }

        // Para otras vistas, actualizamos el iframe como antes
        updateIframeUrl(viewName);

        // Si hay una función de callback proporcionada desde el padre, la llamamos
        if (onViewChange) {
            onViewChange(viewName);
        }
    };

    // Función para manejar la navegación a un formato específico
    const handleFormatoClick = (formatoNumber: number) => {
        // Define las rutas para cada formato
        let formatoRoute = '';
        switch(formatoNumber) {
            case 1:
                formatoRoute = 'ambiental';
                break;
            case 2:
                formatoRoute = 'perforacion';
                break;
            case 3:
                formatoRoute = 'produccion';
                break;
            case 4:
                formatoRoute = 'mantenimiento';
                break;
            case 5:
                formatoRoute = 'seguridad';
                break;
            case 6:
                formatoRoute = 'calidad';
                break;
            case 7:
                formatoRoute = 'logistica';
                break;
            case 8:
                formatoRoute = 'recursos-humanos';
                break;
            case 9:
                formatoRoute = 'finanzas';
                break;
            case 10:
                formatoRoute = 'administracion';
                break;
            default:
                formatoRoute = `${formatoNumber}`;
        }

        // Actualizar estado y navegar
        setCurrentFormatoId(formatoRoute);
        setCurrentView('formatos');
        navigate(`/formato/${formatoRoute}`);
    };

    // Función para actualizar la URL del iframe basado en la vista seleccionada
    const updateIframeUrl = (viewName: string) => {
        // Mapeo de nombres de vista a URLs
        const viewUrls: {[key: string]: string} = {
            'default': '/views/default-view',
            'analytics': '/views/analytics-view',
            'analytics_users': '/views/analytics-users-view',
            'sales': '/views/sales-view',
            'sales_regions': '/views/sales-regions-view',
            'operations': '/views/operations-view',
            'operations_resources': '/views/operations-resources-view',
            'alerts': '/views/alerts-view',
            'alerts_history': '/views/alerts-history-view',
        };

        // Solo establecer la URL y forzar refresco si la vista usa iframe
        if (viewName !== 'default' && viewName !== 'formatos') {
            setIframeUrl(viewUrls[viewName] || viewUrls['default']);
            setIframeKey(prevKey => prevKey + 1);
        }
    };

    // Función para renderizar el formato específico según el ID
    const renderFormatoEspecifico = () => {
        if (!currentFormatoId) return null;

        switch(currentFormatoId) {
            case 'ambiental':
                // Envolvemos Ambi en un div con clase especial para contener sus estilos
                return (
                    <div className="ambi-container">
                        <Ambi />
                    </div>
                );
            // Otros casos aquí cuando tengas más formatos implementados
            default:
                return (
                    <div style={{ padding: '20px' }}>
                        <h1>Formato {currentFormatoId}</h1>
                        <p>Este formato aún no está implementado.</p>
                        <button onClick={() => navigate('/dashboard/formatos')}>Volver a Formatos</button>
                    </div>
                );
        }
    };

    // Determinar qué contenido mostrar
    const renderContent = () => {
        if (currentView === 'default') {
            return <PaginaPrincipal />;
        } else if (currentView === 'formatos') {
            // Mostrar un formato específico o la cuadrícula de formatos
            return currentFormatoId
                ? renderFormatoEspecifico()
                : <FormatoGrid onFormatoClick={handleFormatoClick} />;
        } else {
            // Para otras vistas, seguimos usando el iframe
            return (
                <iframe
                    key={iframeKey}
                    src={iframeUrl}
                    className="dashboard-iframe"
                    title="Dashboard View"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            );
        }
    };

    return (
        <div className="dashboard-container">
            <Sidebar
                collapsed={collapsed}
                toggleSidebar={toggleSidebar}
                changeView={changeView}
                currentView={currentView}
            />

            <div className={`dashboard-content ${collapsed ? 'sidebar-collapsed' : ''}`}>
                <Topbar
                    viewName={currentView}
                    changeView={changeView}
                />
                <div className="main-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;