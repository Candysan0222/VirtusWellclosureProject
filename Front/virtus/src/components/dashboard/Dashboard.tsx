import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import PaginaPrincipal from './PaginaPrincipal'; // Importamos directamente el componente
import './Dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faChartBar,
    faChartLine,
    faMapMarkedAlt,
    faClipboardList,
    faBell,
    faEllipsisH,
    faInfoCircle,
    faExclamationTriangle,
    faCheckCircle,
    faExclamationCircle
} from '@fortawesome/free-solid-svg-icons';

interface DashboardProps {
    // Añadimos props para permitir control desde componentes padre
    initialView?: string;
    onViewChange?: (viewName: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ initialView = 'default', onViewChange }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentView, setCurrentView] = useState(initialView);
    const [iframeUrl, setIframeUrl] = useState('');
    const [iframeKey, setIframeKey] = useState(0); // Para forzar el refresco del iframe

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const changeView = (viewName: string) => {
        setCurrentView(viewName);
        // Actualizamos la URL del iframe basado en la vista seleccionada
        updateIframeUrl(viewName);

        // Si hay una función de callback proporcionada desde el padre, la llamamos
        if (onViewChange) {
            onViewChange(viewName);
        }
    };

    // Función para actualizar la URL del iframe basado en la vista seleccionada
    const updateIframeUrl = (viewName: string) => {
        // Mapeo de nombres de vista a URLs
        const viewUrls: {[key: string]: string} = {
            'default': '/views/default-view', // Mantiene la ruta original pero no se usará para 'default'
            'analytics': '/views/analytics-view',
            'analytics_users': '/views/analytics-users-view',
            'sales': '/views/sales-view',
            'sales_regions': '/views/sales-regions-view',
            'operations': '/views/operations-view',
            'operations_resources': '/views/operations-resources-view',
            'alerts': '/views/alerts-view',
            'alerts_history': '/views/alerts-history-view',
        };

        // Solo establecer la URL y forzar refresco si no es la vista 'default'
        if (viewName !== 'default') {
            setIframeUrl(viewUrls[viewName] || viewUrls['default']);
            setIframeKey(prevKey => prevKey + 1);
        }
    };

    // Efecto para establecer la URL inicial del iframe
    useEffect(() => {
        if (initialView !== 'default') {
            updateIframeUrl(initialView);
        }
    }, [initialView]);

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
                    {currentView === 'default' ? (
                        // Renderizamos directamente el componente PaginaPrincipal
                        <PaginaPrincipal />
                    ) : (
                        // Para otras vistas seguimos usando el iframe
                        <iframe
                            key={iframeKey}
                            src={iframeUrl}
                            className="dashboard-iframe"
                            title="Dashboard View"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;