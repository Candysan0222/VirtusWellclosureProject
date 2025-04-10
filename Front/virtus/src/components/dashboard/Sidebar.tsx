import React, {useState, useEffect} from 'react';
import './Sidebar.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faChartPie,
    faShoppingCart,
    faCogs,
    faBell,
    faChevronDown,
    faAngleLeft,
    faUserCircle,
    faSearch,
    faEnvelope,
    faCog,
    faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

import logo from '../../assets/logo.png';
import logoCollapsed from '../../assets/isotipo.png'; // Logo alternativo para sidebar colapsado

interface SidebarProps {
    collapsed: boolean;
    toggleSidebar: () => void;
    changeView: (viewName: string) => void;
    currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({collapsed, toggleSidebar, changeView, currentView}) => {
    const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({
        analytics: false,
        sales: false,
        operations: false,
        alerts: false
    });

    const toggleMenu = (menu: string) => {
        if (!collapsed) {
            setOpenMenus(prev => ({
                ...prev,
                [menu]: !prev[menu]
            }));
        }
    };

    // Verificar si una vista está activa
    const isViewActive = (view: string) => currentView === view;

    // Navegación entre vistas
    const handleNavigation = (view: string) => {
        changeView(view);
    };

    // Manejadores para expandir/colapsar al pasar el mouse
    const handleMouseEnter = () => {
        if (collapsed) {
            toggleSidebar();
        }
    };

    const handleMouseLeave = () => {
        if (!collapsed) {
            toggleSidebar();
        }
    };

    // Componente de submenu para evitar repetición de código
    const renderSubmenu = (
        menuKey: string,
        items: Array<{view: string, label: string}>,
        isOpen: boolean
    ) => (
        <ul className={`submenu ${isOpen ? 'open' : ''}`}>
            {items.map(item => (
                <li className="nav-item" key={item.view}>
                    <div
                        className={`nav-link ${isViewActive(item.view) ? 'active' : ''}`}
                        onClick={() => handleNavigation(item.view)}
                    >
                        <span className="nav-text">{item.label}</span>
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={`sidebar ${collapsed ? 'collapsed' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Header del Sidebar */}
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src={logo} alt="Logo de la aplicación" className="logo logo-expanded" />
                    <img src={logoCollapsed} alt="Logo de la aplicación" className="logo logo-collapsed" />
                    <span className="logo-text"></span>
                </div>
                {/* Ya no necesitamos el botón de toggle */}
            </div>

            {/* Navegación */}
            <nav className="sidebar-nav">
                {/* Dashboard */}
                <div className="nav-section">
                    <div className="nav-section-title">Principal</div>
                    <ul>
                        <li
                            className="nav-item"
                            data-tooltip="Dashboard"
                        >
                            <div
                                className={`nav-link ${isViewActive('default') ? 'active' : ''}`}
                                onClick={() => handleNavigation('default')}
                                role="button"
                                tabIndex={0}
                                aria-current={isViewActive('default') ? 'page' : undefined}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faTachometerAlt}/>
                                </span>
                                <span className="nav-text">Dashboard</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Análisis */}
                <div className="nav-section">
                    <div className="nav-section-title">Análisis</div>
                    <ul>
                        <li
                            className="nav-item"
                            data-tooltip="Analíticas"
                        >
                            <div
                                className={`nav-link ${isViewActive('analytics') ? 'active' : ''} ${openMenus.analytics ? 'open' : ''}`}
                                onClick={() => toggleMenu('analytics')}
                                role="button"
                                tabIndex={0}
                                aria-expanded={openMenus.analytics}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faChartPie}/>
                                </span>
                                <span className="nav-text">Analíticas</span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="nav-caret"
                                    aria-hidden="true"
                                />
                            </div>
                            {renderSubmenu('analytics', [
                                {view: 'analytics', label: 'Visión General'},
                                {view: 'analytics_users', label: 'Usuarios'}
                            ], openMenus.analytics)}
                        </li>
                    </ul>
                </div>

                {/* Ventas */}
                <div className="nav-section">
                    <div className="nav-section-title">Ventas</div>
                    <ul>
                        <li
                            className="nav-item"
                            data-tooltip="Ventas"
                        >
                            <div
                                className={`nav-link ${isViewActive('sales') ? 'active' : ''} ${openMenus.sales ? 'open' : ''}`}
                                onClick={() => toggleMenu('sales')}
                                role="button"
                                tabIndex={0}
                                aria-expanded={openMenus.sales}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faShoppingCart}/>
                                </span>
                                <span className="nav-text">Ventas</span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="nav-caret"
                                    aria-hidden="true"
                                />
                            </div>
                            {renderSubmenu('sales', [
                                {view: 'sales', label: 'Resumen'},
                                {view: 'sales_regions', label: 'Por Región'}
                            ], openMenus.sales)}
                        </li>
                    </ul>
                </div>

                {/* Operaciones */}
                <div className="nav-section">
                    <div className="nav-section-title">Operaciones</div>
                    <ul>
                        <li
                            className="nav-item"
                            data-tooltip="Operaciones"
                        >
                            <div
                                className={`nav-link ${isViewActive('operations') ? 'active' : ''} ${openMenus.operations ? 'open' : ''}`}
                                onClick={() => toggleMenu('operations')}
                                role="button"
                                tabIndex={0}
                                aria-expanded={openMenus.operations}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faCogs}/>
                                </span>
                                <span className="nav-text">Operaciones</span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="nav-caret"
                                    aria-hidden="true"
                                />
                            </div>
                            {renderSubmenu('operations', [
                                {view: 'operations', label: 'Estado'},
                                {view: 'operations_resources', label: 'Recursos'}
                            ], openMenus.operations)}
                        </li>
                    </ul>
                </div>

                {/* Alertas */}
                <div className="nav-section">
                    <div className="nav-section-title">Sistemas</div>
                    <ul>
                        <li
                            className="nav-item"
                            data-tooltip="Alertas"
                        >
                            <div
                                className={`nav-link ${isViewActive('alerts') ? 'active' : ''} ${openMenus.alerts ? 'open' : ''}`}
                                onClick={() => toggleMenu('alerts')}
                                role="button"
                                tabIndex={0}
                                aria-expanded={openMenus.alerts}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faBell}/>
                                </span>
                                <span className="nav-text">Alertas</span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className="nav-caret"
                                    aria-hidden="true"
                                />
                            </div>
                            {renderSubmenu('alerts', [
                                {view: 'alerts', label: 'Activas'},
                                {view: 'alerts_history', label: 'Historial'}
                            ], openMenus.alerts)}
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <div className="user-profile">
                    <div className="avatar" aria-label="Iniciales del usuario">JD</div>
                    <div className="user-info">
                        <div className="user-name">Juan Doe</div>
                        <div className="user-role">Administrador</div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;