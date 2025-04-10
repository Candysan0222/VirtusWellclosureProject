import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
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

// Componentes de gráficos
import SpeedometerGauge from '../graficos/SpeedometerGauge';
import BarChartComponent from '../graficos/BarChartComponent';
import LineChartComponent from '../graficos/LineChartComponent';
import LocationMap from '../graficos/LocationMap';
import ProgressBar from '../graficos/ProgressBar';
import AlertsList from '../graficos/AlertsList';
// Ya no importamos AllNotificationsViews porque no lo vamos a usar

interface DashboardProps {
    // Añadimos props para permitir control desde componentes padre
    initialView?: string;
    onViewChange?: (viewName: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ initialView = 'default', onViewChange }) => {
    const [collapsed, setCollapsed] = useState(false);
    const [currentView, setCurrentView] = useState(initialView);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    const changeView = (viewName: string) => {
        setCurrentView(viewName);
        // Si hay una función de callback proporcionada desde el padre, la llamamos
        if (onViewChange) {
            onViewChange(viewName);
        }
    };

    // Renderizar la vista actual
    const renderView = () => {
        switch(currentView) {
            case 'analytics':
                return <AnalyticsView />;
            case 'analytics_users':
                return <AnalyticsView view="users" />;
            case 'sales':
                return <SalesView />;
            case 'sales_regions':
                return <SalesView view="regions" />;
            case 'operations':
                return <OperationsView />;
            case 'operations_resources':
                return <OperationsView view="resources" />;
            case 'alerts':
                return <AlertsView />;
            case 'alerts_history':
                return <AlertsView view="history" />;
            // Eliminamos el caso 'all_notifications'
            case 'default':
            default:
                return <DefaultView />;
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
                    {renderView()}
                </div>
            </div>
        </div>
    );
};

// Componente de tarjeta reutilizable
interface CardProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    large?: boolean;
}

const Card: React.FC<CardProps> = ({ title, children, icon, large = false }) => {
    return (
        <div className={`dashboard-card ${large ? 'large' : ''}`}>
            <div className="card-header">
                <h3>
                    {icon && <span className="card-icon">{icon}</span>}
                    {title}
                </h3>
                <div className="card-actions">
                    <button>
                        <FontAwesomeIcon icon={faEllipsisH} />
                    </button>
                </div>
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

// Componente para alertas
const Alert: React.FC<{
    type: 'critical' | 'warning' | 'info';
    title: string;
    time: string;
}> = ({ type, title, time }) => {
    const getIcon = () => {
        switch (type) {
            case 'critical':
                return <FontAwesomeIcon icon={faExclamationCircle} />;
            case 'warning':
                return <FontAwesomeIcon icon={faExclamationTriangle} />;
            case 'info':
                return <FontAwesomeIcon icon={faInfoCircle} />;
            default:
                return <FontAwesomeIcon icon={faInfoCircle} />;
        }
    };

    return (
        <div className={`alert-item ${type}`}>
            <div className="alert-icon">
                {getIcon()}
            </div>
            <div className="alert-content">
                <div className="alert-title">{title}</div>
                <div className="alert-time">{time}</div>
            </div>
        </div>
    );
};

// Componente para barra de progreso
const Progress: React.FC<{
    label: string;
    value: number;
    color: 'blue' | 'green' | 'orange';
}> = ({ label, value, color }) => {
    return (
        <div className="progress-bar-container">
            <div className="progress-info">
                <div className="progress-label">{label}</div>
                <div className="progress-value">{value}%</div>
            </div>
            <div className="progress-bar-outer">
                <div
                    className={`progress-bar-inner ${color}`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

// Vista Dashboard Principal
const DefaultView: React.FC = () => {
    return (
        <>
            <div className="dashboard-row">
                <Card
                    title="Velocidad del Servidor"
                    icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                >
                    <div className="gauge-container">
                        <SpeedometerGauge value={75} />
                        <div className="gauge-value">75%</div>
                        <div className="gauge-label">Rendimiento actual</div>
                    </div>
                </Card>

                <Card
                    title="Ventas Mensuales"
                    icon={<FontAwesomeIcon icon={faChartBar} />}
                >
                    <div className="chart-container">
                        <BarChartComponent />
                    </div>
                </Card>

                <Card
                    title="Tráfico Web"
                    icon={<FontAwesomeIcon icon={faChartLine} />}
                >
                    <div className="chart-container">
                        <LineChartComponent />
                    </div>
                </Card>
            </div>

            <div className="dashboard-row">
                <Card
                    title="Oficinas y Almacenes"
                    icon={<FontAwesomeIcon icon={faMapMarkedAlt} />}
                >
                    <div className="map-container">
                        <LocationMap />
                    </div>
                </Card>

                <Card
                    title="Estado de Proyectos"
                    icon={<FontAwesomeIcon icon={faClipboardList} />}
                >
                    <div className="progress-container">
                        <Progress label="Proyecto A" value={75} color="blue" />
                        <Progress label="Proyecto B" value={45} color="green" />
                        <Progress label="Proyecto C" value={90} color="orange" />
                    </div>
                </Card>

                <Card
                    title="Alertas del Sistema"
                    icon={<FontAwesomeIcon icon={faBell} />}
                >
                    <div className="alerts-container">
                        <Alert
                            type="critical"
                            title="Servidor principal caído"
                            time="10:25"
                        />
                        <Alert
                            type="warning"
                            title="Pico de tráfico detectado"
                            time="09:15"
                        />
                        <Alert
                            type="info"
                            title="Mantenimiento programado"
                            time="08:30"
                        />
                    </div>
                </Card>
            </div>
        </>
    );
};

// Vista de Analíticas
interface AnalyticsViewProps {
    view?: 'general' | 'users';
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ view = 'general' }) => {
    if (view === 'users') {
        return (
            <>
                <div className="dashboard-row">
                    <Card
                        title="Usuarios Activos"
                        icon={<FontAwesomeIcon icon={faChartLine} />}
                        large={true}
                    >
                        <div className="chart-container">
                            <LineChartComponent />
                        </div>
                    </Card>

                    <Card
                        title="Retención de Usuarios"
                        icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                    >
                        <div className="gauge-container">
                            <SpeedometerGauge value={78} />
                            <div className="gauge-value">78%</div>
                            <div className="gauge-label">Tasa de retención</div>
                        </div>
                    </Card>
                </div>

                <div className="dashboard-row">
                    <Card
                        title="Distribución Demográfica"
                        icon={<FontAwesomeIcon icon={faChartBar} />}
                    >
                        <div className="chart-container">
                            <BarChartComponent />
                        </div>
                    </Card>

                    <Card
                        title="Distribución Geográfica"
                        icon={<FontAwesomeIcon icon={faMapMarkedAlt} />}
                    >
                        <div className="map-container">
                            <LocationMap />
                        </div>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="dashboard-row">
                <Card
                    title="Tendencias de Tráfico"
                    icon={<FontAwesomeIcon icon={faChartLine} />}
                    large={true}
                >
                    <div className="chart-container">
                        <LineChartComponent />
                    </div>
                </Card>

                <Card
                    title="Índice de Conversión"
                    icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                >
                    <div className="gauge-container">
                        <SpeedometerGauge value={92} />
                        <div className="gauge-value">92%</div>
                        <div className="gauge-label">Conversión actual</div>
                    </div>
                </Card>
            </div>

            <div className="dashboard-row">
                <Card
                    title="Usuarios por Plataforma"
                    icon={<FontAwesomeIcon icon={faChartBar} />}
                >
                    <div className="chart-container">
                        <BarChartComponent />
                    </div>
                </Card>

                <Card
                    title="Tiempo en Página"
                    icon={<FontAwesomeIcon icon={faChartBar} />}
                >
                    <div className="chart-container">
                        <BarChartComponent />
                    </div>
                </Card>

                <Card
                    title="Objetivos Mensuales"
                    icon={<FontAwesomeIcon icon={faClipboardList} />}
                >
                    <div className="progress-container">
                        <Progress label="Visitas" value={85} color="blue" />
                        <Progress label="Suscripciones" value={62} color="green" />
                        <Progress label="Ventas" value={78} color="orange" />
                    </div>
                </Card>
            </div>
        </>
    );
};

// Vista de Ventas
interface SalesViewProps {
    view?: 'general' | 'regions';
}

const SalesView: React.FC<SalesViewProps> = ({ view = 'general' }) => {
    if (view === 'regions') {
        return (
            <>
                <div className="dashboard-row">
                    <Card
                        title="Ventas por Región"
                        icon={<FontAwesomeIcon icon={faChartBar} />}
                        large={true}
                    >
                        <div className="chart-container">
                            <BarChartComponent />
                        </div>
                    </Card>

                    <Card
                        title="Mapa de Ventas"
                        icon={<FontAwesomeIcon icon={faMapMarkedAlt} />}
                        large={true}
                    >
                        <div className="map-container">
                            <LocationMap />
                        </div>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="dashboard-row">
                <Card
                    title="Ventas por Región"
                    icon={<FontAwesomeIcon icon={faChartBar} />}
                >
                    <div className="chart-container">
                        <BarChartComponent />
                    </div>
                </Card>

                <Card
                    title="Tendencia de Ventas"
                    icon={<FontAwesomeIcon icon={faChartLine} />}
                >
                    <div className="chart-container">
                        <LineChartComponent />
                    </div>
                </Card>

                <Card
                    title="Objetivo Mensual"
                    icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                >
                    <div className="gauge-container">
                        <SpeedometerGauge value={85} />
                        <div className="gauge-value">85%</div>
                        <div className="gauge-label">Completado</div>
                    </div>
                </Card>
            </div>

            <div className="dashboard-row">
                <Card
                    title="Mapa de Ventas Global"
                    icon={<FontAwesomeIcon icon={faMapMarkedAlt} />}
                    large={true}
                >
                    <div className="map-container">
                        <LocationMap />
                    </div>
                </Card>

                <Card
                    title="Oportunidades de Venta"
                    icon={<FontAwesomeIcon icon={faBell} />}
                >
                    <div className="alerts-container">
                        <Alert
                            type="info"
                            title="Nueva oportunidad: Tech Solutions"
                            time="Hace 2 horas"
                        />
                        <Alert
                            type="info"
                            title="Seguimiento: Global Industries"
                            time="Hace 1 día"
                        />
                        <Alert
                            type="warning"
                            title="Oportunidad en riesgo: ABC Corp"
                            time="Hace 3 días"
                        />
                    </div>
                </Card>
            </div>
        </>
    );
};

// Vista de Operaciones
interface OperationsViewProps {
    view?: 'status' | 'resources';
}

const OperationsView: React.FC<OperationsViewProps> = ({ view = 'status' }) => {
    if (view === 'resources') {
        return (
            <>
                <div className="dashboard-row">
                    <Card
                        title="Distribución de Recursos"
                        icon={<FontAwesomeIcon icon={faChartBar} />}
                        large={true}
                    >
                        <div className="chart-container">
                            <BarChartComponent />
                        </div>
                    </Card>

                    <Card
                        title="Uso de Recursos en Tiempo Real"
                        icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                    >
                        <div className="gauge-container">
                            <SpeedometerGauge value={72} />
                            <div className="gauge-value">72%</div>
                            <div className="gauge-label">Utilización</div>
                        </div>
                    </Card>
                </div>

                <div className="dashboard-row">
                    <Card
                        title="Recursos por Departamento"
                        icon={<FontAwesomeIcon icon={faChartBar} />}
                    >
                        <div className="chart-container">
                            <BarChartComponent />
                        </div>
                    </Card>

                    <Card
                        title="Disponibilidad de Recursos"
                        icon={<FontAwesomeIcon icon={faClipboardList} />}
                    >
                        <div className="progress-container">
                            <Progress label="Servidores" value={85} color="blue" />
                            <Progress label="Almacenamiento" value={62} color="green" />
                            <Progress label="Ancho de banda" value={78} color="orange" />
                        </div>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="dashboard-row">
                <Card
                    title="Eficiencia Operativa"
                    icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                >
                    <div className="gauge-container">
                        <SpeedometerGauge value={65} />
                        <div className="gauge-value">65%</div>
                        <div className="gauge-label">Eficiencia actual</div>
                    </div>
                </Card>

                <Card
                    title="Proyectos en Curso"
                    icon={<FontAwesomeIcon icon={faClipboardList} />}
                >
                    <div className="progress-container">
                        <Progress label="Desarrollo Frontend" value={80} color="blue" />
                        <Progress label="API Backend" value={65} color="green" />
                        <Progress label="Infraestructura" value={40} color="orange" />
                        <Progress label="Pruebas" value={25} color="blue" />
                    </div>
                </Card>

                <Card
                    title="Incidencias Técnicas"
                    icon={<FontAwesomeIcon icon={faBell} />}
                >
                    <div className="alerts-container">
                        <Alert
                            type="critical"
                            title="Error en servidor de producción"
                            time="10:25"
                        />
                        <Alert
                            type="warning"
                            title="Alta carga en base de datos"
                            time="09:40"
                        />
                        <Alert
                            type="info"
                            title="Actualización programada"
                            time="08:15"
                        />
                    </div>
                </Card>
            </div>

            <div className="dashboard-row">
                <Card
                    title="Recursos por Departamento"
                    icon={<FontAwesomeIcon icon={faChartBar} />}
                >
                    <div className="chart-container">
                        <BarChartComponent />
                    </div>
                </Card>

                <Card
                    title="Centros Operativos"
                    icon={<FontAwesomeIcon icon={faMapMarkedAlt} />}
                    large={true}
                >
                    <div className="map-container">
                        <LocationMap />
                    </div>
                </Card>
            </div>
        </>
    );
};

// Vista de Alertas
interface AlertsViewProps {
    view?: 'active' | 'history';
}

const AlertsView: React.FC<AlertsViewProps> = ({ view = 'active' }) => {
    if (view === 'history') {
        return (
            <>
                <div className="dashboard-row">
                    <Card
                        title="Historial de Alertas"
                        icon={<FontAwesomeIcon icon={faChartLine} />}
                        large={true}
                    >
                        <div className="chart-container">
                            <LineChartComponent />
                        </div>
                    </Card>

                    <Card
                        title="Distribución por Tipo"
                        icon={<FontAwesomeIcon icon={faChartBar} />}
                    >
                        <div className="chart-container">
                            <BarChartComponent />
                        </div>
                    </Card>
                </div>

                <div className="dashboard-row">
                    <Card
                        title="Tiempo de Resolución"
                        icon={<FontAwesomeIcon icon={faClipboardList} />}
                    >
                        <div className="progress-container">
                            <Progress label="Alertas críticas" value={90} color="blue" />
                            <Progress label="Alertas de advertencia" value={85} color="green" />
                            <Progress label="Alertas informativas" value={95} color="orange" />
                        </div>
                    </Card>

                    <Card
                        title="Resolución de Problemas"
                        icon={<FontAwesomeIcon icon={faCheckCircle} />}
                    >
                        <div className="alerts-container">
                            <Alert
                                type="info"
                                title="Servidor principal restaurado"
                                time="Hace 2 días"
                            />
                            <Alert
                                type="info"
                                title="Carga de base de datos normalizada"
                                time="Hace 3 días"
                            />
                            <Alert
                                type="info"
                                title="Actualización completada con éxito"
                                time="Hace 5 días"
                            />
                        </div>
                    </Card>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="dashboard-row">
                <Card
                    title="Alertas Críticas"
                    icon={<FontAwesomeIcon icon={faBell} />}
                    large={true}
                >
                    <div className="alerts-container">
                        <Alert
                            type="critical"
                            title="Servidor principal caído"
                            time="10:25"
                        />
                        <Alert
                            type="critical"
                            title="Error en sistema de pagos"
                            time="09:50"
                        />
                        <Alert
                            type="critical"
                            title="Fallo en backup automático"
                            time="08:15"
                        />
                        <Alert
                            type="critical"
                            title="Problema de seguridad detectado"
                            time="Ayer, 23:30"
                        />
                    </div>
                </Card>

                <Card
                    title="Nivel de Riesgo"
                    icon={<FontAwesomeIcon icon={faTachometerAlt} />}
                >
                    <div className="gauge-container">
                        <SpeedometerGauge value={45} />
                        <div className="gauge-value">45%</div>
                        <div className="gauge-label">Nivel de riesgo actual</div>
                    </div>
                </Card>
            </div>

            <div className="dashboard-row">
                <Card
                    title="Historial de Incidencias"
                    icon={<FontAwesomeIcon icon={faChartLine} />}
                >
                    <div className="chart-container">
                        <LineChartComponent />
                    </div>
                </Card>

                <Card
                    title="Alertas por Categoría"
                    icon={<FontAwesomeIcon icon={faChartBar} />}
                >
                    <div className="chart-container">
                        <BarChartComponent />
                    </div>
                </Card>

                <Card
                    title="Resolución de Problemas"
                    icon={<FontAwesomeIcon icon={faClipboardList} />}
                >
                    <div className="progress-container">
                        <Progress label="Incidencias críticas" value={65} color="blue" />
                        <Progress label="Tiempo de respuesta" value={82} color="green" />
                        <Progress label="Tiempo de resolución" value={45} color="orange" />
                    </div>
                </Card>
            </div>
        </>
    );
};

export default Dashboard;