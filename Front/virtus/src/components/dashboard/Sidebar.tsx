import React, { useState } from 'react';
import './Sidebar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTachometerAlt,
    faChartLine,
    faMapMarkedAlt,
    faFileAlt,
    faDatabase,
    faUserPlus,
    faUsers,
    faCogs,
    faExclamationTriangle,
    faBell,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';

import logo from '../../assets/logo.png';
import logoCollapsed from '../../assets/isotipo.png';

interface SidebarProps {
    collapsed: boolean;
    toggleSidebar: () => void;
    changeView: (viewName: string) => void;
    currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar, changeView, currentView }) => {
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

    const isViewActive = (view: string) => currentView === view;

    const handleNavigation = (view: string) => {
        changeView(view);
    };

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

    const renderSubmenu = (
        menuKey: string,
        items: Array<{ view: string, label: string, icon: any }>,
        isOpen: boolean
    ) => (
        <ul className={`submenu ${isOpen ? 'open' : ''}`}>
            {items.map(item => (
                <li className="nav-item" key={item.view}>
                    <div
                        className={`nav-link ${isViewActive(item.view) ? 'active' : ''}`}
                        onClick={() => handleNavigation(item.view)}
                    >
                        <span className="nav-icon">
                            <FontAwesomeIcon icon={item.icon} />
                        </span>
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
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src={logo} alt="Logo de la aplicación" className="logo logo-expanded" />
                    <img src={logoCollapsed} alt="Logo de la aplicación" className="logo logo-collapsed" />
                    <span className="logo-text"></span>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <ul>
                        <li className="nav-item" data-tooltip="Dashboard">
                            <div
                                className={`nav-link ${isViewActive('default') ? 'active' : ''}`}
                                onClick={() => handleNavigation('default')}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faTachometerAlt} />
                                </span>
                                <span className="nav-text">Dashboard</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <ul>
                        <li className="nav-item" data-tooltip="Gráficos">
                            <div
                                className={`nav-link ${isViewActive('analytics') ? 'active' : ''} ${openMenus.analytics ? 'open' : ''}`}
                                onClick={() => toggleMenu('analytics')}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faChartLine} />
                                </span>
                                <span className="nav-text">Gráficos</span>
                                <FontAwesomeIcon icon={faChevronDown} className="nav-caret" />
                            </div>
                            {renderSubmenu('analytics', [
                                { view: 'analytics', label: 'Gráficos', icon: faChartLine },
                                { view: 'analytics_users', label: 'Mapa de pozos', icon: faMapMarkedAlt }
                            ], openMenus.analytics)}
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <ul>
                        <li className="nav-item" data-tooltip="Formularios">
                            <div
                                className={`nav-link ${isViewActive('sales') ? 'active' : ''} ${openMenus.sales ? 'open' : ''}`}
                                onClick={() => toggleMenu('sales')}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faFileAlt} />
                                </span>
                                <span className="nav-text">Formularios</span>
                                <FontAwesomeIcon icon={faChevronDown} className="nav-caret" />
                            </div>
                            {renderSubmenu('sales', [
                                { view: 'sales', label: 'Formularios', icon: faFileAlt },
                                { view: 'sales_regions', label: 'Registros pozos', icon: faDatabase }
                            ], openMenus.sales)}
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <ul>
                        <li className="nav-item" data-tooltip="Gestión de usuarios">
                            <div
                                className={`nav-link ${isViewActive('operations') ? 'active' : ''} ${openMenus.operations ? 'open' : ''}`}
                                onClick={() => toggleMenu('operations')}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faCogs} />
                                </span>
                                <span className="nav-text">Gestión de usuarios</span>
                                <FontAwesomeIcon icon={faChevronDown} className="nav-caret" />
                            </div>
                            {renderSubmenu('operations', [
                                { view: 'operations', label: 'Registrar usuario', icon: faUserPlus },
                                { view: 'operations_resources', label: 'Registros', icon: faUsers }
                            ], openMenus.operations)}
                        </li>
                    </ul>
                </div>

                <div className="nav-section">
                    <ul>
                        <li className="nav-item" data-tooltip="Alertas">
                            <div
                                className={`nav-link ${isViewActive('alerts') ? 'active' : ''} ${openMenus.alerts ? 'open' : ''}`}
                                onClick={() => toggleMenu('alerts')}
                            >
                                <span className="nav-icon">
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                </span>
                                <span className="nav-text">Alertas</span>
                                <FontAwesomeIcon icon={faChevronDown} className="nav-caret" />
                            </div>
                            {renderSubmenu('alerts', [
                                { view: 'alerts', label: 'Alertas', icon: faExclamationTriangle },
                                { view: 'alerts_history', label: 'Notificaciones', icon: faBell }
                            ], openMenus.alerts)}
                        </li>
                    </ul>
                </div>
            </nav>

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
