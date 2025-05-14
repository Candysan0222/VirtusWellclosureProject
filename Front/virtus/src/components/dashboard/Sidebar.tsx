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

interface MenuItem {
    id: string;
    icon: any;
    label: string;
    view: string;
    hasSubmenu: boolean;
    submenu: Array<{ view: string, label: string, icon: any }>;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, toggleSidebar, changeView, currentView }) => {
    const [hoveredSidebar, setHoveredSidebar] = useState(false);
    const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);

    // Determina si el sidebar debe mostrarse expandido según el estado de hover
    const isSidebarExpanded = !collapsed || hoveredSidebar;
    const sidebarClassName = `sidebar ${!isSidebarExpanded ? 'collapsed' : ''}`;

    const isViewActive = (view: string) => currentView === view;

    const handleNavigation = (view: string, event: React.MouseEvent) => {
        event.stopPropagation();
        changeView(view);
        if (window.innerWidth <= 768) {
            toggleSidebar();
        }
    };

    const menuItems: MenuItem[] = [
        {
            id: 'dashboard',
            icon: faTachometerAlt,
            label: 'Dashboard',
            view: 'default',
            hasSubmenu: false,
            submenu: []
        },
        {
            id: 'analytics',
            icon: faChartLine,
            label: 'Gráficos',
            view: 'analytics',
            hasSubmenu: true,
            submenu: [
                { view: 'analytics', label: 'Gráficos', icon: faChartLine },
                { view: 'analytics_users', label: 'Mapa de pozos', icon: faMapMarkedAlt }
            ]
        },
        {
            id: 'sales',
            icon: faFileAlt,
            label: 'Formularios',
            view: 'formatos',
            hasSubmenu: true,
            submenu: [
                { view: 'formatos', label: 'Formatos', icon: faFileAlt },
                { view: 'sales_regions', label: 'Registros pozos', icon: faDatabase }
            ]
        },
        {
            id: 'operations',
            icon: faCogs,
            label: 'Gestión de usuarios',
            view: 'operations',
            hasSubmenu: true,
            submenu: [
                { view: 'operations', label: 'Registrar usuario', icon: faUserPlus },
                { view: 'operations_resources', label: 'Registros', icon: faUsers }
            ]
        },
        {
            id: 'alerts',
            icon: faExclamationTriangle,
            label: 'Alertas',
            view: 'alerts',
            hasSubmenu: true,
            submenu: [
                { view: 'alerts', label: 'Alertas', icon: faExclamationTriangle },
                { view: 'alerts_history', label: 'Notificaciones', icon: faBell }
            ]
        }
    ];

    const renderSubmenu = (
        menuKey: string,
        items: Array<{ view: string, label: string, icon: any }>
    ) => (
        <ul className={`submenu ${(hoveredMenu === menuKey && isSidebarExpanded) ? 'open' : ''}`}>
            {items.map(item => (
                <li className="nav-item" key={item.view} data-tooltip={item.label}>
                    <div
                        className={`nav-link ${isViewActive(item.view) ? 'active' : ''}`}
                        onClick={(e) => handleNavigation(item.view, e)}
                    >
                        <div className="nav-content">
                            <div className="nav-icon-container">
                                <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                            </div>
                            <div className="nav-text-container">
                                <span className="nav-text">{item.label}</span>
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );

    return (
        <aside
            className={sidebarClassName}
            onMouseEnter={() => setHoveredSidebar(true)}
            onMouseLeave={() => {
                setHoveredSidebar(false);
                setHoveredMenu(null);
            }}
        >
            <div className="sidebar-header">
                <div className="logo-container">
                    <img src={logo} alt="Logo de la aplicación" className="logo logo-expanded" />
                    <img src={logoCollapsed} alt="Logo" className="logo logo-collapsed" />
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map(item => (
                    <div
                        className="nav-section"
                        key={item.id}
                        onMouseEnter={() => item.hasSubmenu && setHoveredMenu(item.id)}
                        onMouseLeave={() => item.hasSubmenu && setHoveredMenu(null)}
                    >
                        <ul>
                            <li className="nav-item" data-tooltip={item.label}>
                                <div
                                    className={`nav-link ${
                                        isViewActive(item.view) ||
                                        item.submenu.some(subItem => isViewActive(subItem.view))
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={(e) => !item.hasSubmenu && handleNavigation(item.view, e)}
                                >
                                    <div className="nav-content">
                                        <div className="nav-icon-container">
                                            <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                                        </div>
                                        <div className="nav-text-container">
                                            <span className="nav-text">{item.label}</span>
                                        </div>
                                        {item.hasSubmenu && (
                                            <div className="nav-caret-container">
                                                <FontAwesomeIcon icon={faChevronDown} className="nav-caret" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {item.hasSubmenu && renderSubmenu(item.id, item.submenu)}
                            </li>
                        </ul>
                    </div>
                ))}
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