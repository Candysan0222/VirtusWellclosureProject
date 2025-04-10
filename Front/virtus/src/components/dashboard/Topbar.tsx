import React, {useState, useRef, useEffect} from 'react';
import './Topbar.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {
    faSearch,
    faBell,
    faEnvelope,
    faCog,
    faUser,
    faClipboardList,
    faSignOutAlt,
    faChevronDown,
    faExclamationCircle,
    faInfoCircle,
    faCheckCircle,
    faTimes
} from '@fortawesome/free-solid-svg-icons';

interface TopbarProps {
    viewName: string;
    changeView?: (viewName: string) => void;
}

const Topbar: React.FC<TopbarProps> = ({viewName, changeView}) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState<number[]>([0, 1]);
    const [showPopup, setShowPopup] = useState(false); // Estado para controlar la ventana emergente

    const notificationsRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // Formatear nombre de la vista para mostrar en el título
    const formatViewName = (name: string) => {
        switch (name) {
            case 'default':
                return 'Dashboard';
            case 'analytics':
                return 'Analíticas';
            case 'analytics_users':
                return 'Usuarios';
            case 'sales':
                return 'Ventas';
            case 'sales_regions':
                return 'Ventas por Región';
            case 'operations':
                return 'Operaciones';
            case 'operations_resources':
                return 'Recursos';
            case 'alerts':
                return 'Alertas';
            case 'alerts_history':
                return 'Historial de Alertas';
            default:
                return 'Dashboard';
        }
    };

    // Manejar clics fuera de los menús desplegables para cerrarlos
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // Cerrar menú de notificaciones si está abierto y se hace clic fuera
            if (showNotifications && notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }

            // Cerrar menú de usuario si está abierto y se hace clic fuera
            if (showUserMenu && userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }

            // Cerrar popup si está abierto y se hace clic fuera
            if (showPopup && popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setShowPopup(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotifications, showUserMenu, showPopup]);

    // Alternar menú de notificaciones
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (showUserMenu) setShowUserMenu(false);
    };

    // Alternar menú de usuario
    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
        if (showNotifications) setShowNotifications(false);
    };

    // Alternar búsqueda en móvil
    const toggleMobileSearch = () => {
        setShowMobileSearch(!showMobileSearch);
    };

    // Marcar todas las notificaciones como leídas
    const markAllAsRead = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevenir la navegación

        // Aplicar la clase fading a todos los indicadores
        const unreadIndicators = document.querySelectorAll('.notification-unread');
        unreadIndicators.forEach(indicator => {
            indicator.classList.add('fading');
        });

        // Esperar a que termine la transición antes de eliminar las notificaciones
        setTimeout(() => {
            setUnreadNotifications([]); // Vaciar el array de notificaciones no leídas
        }, 300); // Mismo tiempo que la duración de la transición (0.3s)
    };

    // Mostrar popup de "No hay más notificaciones"
    const viewAllNotifications = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevenir la navegación
        setShowPopup(true); // Mostrar la ventana emergente
        setShowNotifications(false); // Cerrar el menú de notificaciones
    };

    // Cerrar la ventana emergente
    const closePopup = () => {
        setShowPopup(false);
    };

    // Verificar si una notificación está sin leer
    const isUnread = (index: number) => {
        return unreadNotifications.includes(index);
    };

    return (
        <div className="topbar">
            {/* Sección izquierda */}
            <div className="topbar-left">
                <h1 className="page-title">{formatViewName(viewName)}</h1>
                <div className="breadcrumb">
                    <a href="#">Inicio</a>
                    <span className="separator">/</span>
                    <span>{formatViewName(viewName)}</span>
                </div>
            </div>

            {/* Sección derecha */}
            <div className="topbar-right">
                {/* Botón de búsqueda en móvil */}
                <button className="action-btn mobile-search-btn" onClick={toggleMobileSearch} style={{display: 'none'}}>
                    <FontAwesomeIcon icon={faSearch}/>
                </button>

                {/* Notificaciones */}
                <div ref={notificationsRef}>
                    <button className={`action-btn ${unreadNotifications.length > 0 ? 'has-notifications' : ''}`}
                            onClick={toggleNotifications}>
                        <FontAwesomeIcon icon={faBell}/>
                    </button>

                    {/* Menú desplegable de notificaciones */}
                    <div className={`dropdown-menu ${!showNotifications ? 'hidden' : ''}`}>
                        <div className="dropdown-header">
                            <h4>Notificaciones</h4>
                            <a href="#" onClick={markAllAsRead}>Marcar todo como leído</a>
                        </div>
                        <div className="dropdown-body">
                            <div className="notification-item">
                                <div className="notification-icon danger">
                                    <FontAwesomeIcon icon={faExclamationCircle}/>
                                </div>
                                <div className="notification-content">
                                    <div className="notification-title">Servidor principal caído</div>
                                    <div className="notification-message">El servidor principal ha dejado de responder.
                                        Se ha iniciado el proceso de recuperación.
                                    </div>
                                    <div className="notification-time">Hace 5 minutos</div>
                                </div>
                                {isUnread(0) && <div className="notification-unread"></div>}
                            </div>
                            <div className="notification-item">
                                <div className="notification-icon warning">
                                    <FontAwesomeIcon icon={faInfoCircle}/>
                                </div>
                                <div className="notification-content">
                                    <div className="notification-title">Pico de tráfico detectado</div>
                                    <div className="notification-message">Se ha detectado un aumento inusual de tráfico
                                        en la plataforma.
                                    </div>
                                    <div className="notification-time">Hace 30 minutos</div>
                                </div>
                                {isUnread(1) && <div className="notification-unread"></div>}
                            </div>
                            <div className="notification-item">
                                <div className="notification-icon success">
                                    <FontAwesomeIcon icon={faCheckCircle}/>
                                </div>
                                <div className="notification-content">
                                    <div className="notification-title">Actualización completada</div>
                                    <div className="notification-message">La actualización del sistema se ha completado
                                        correctamente.
                                    </div>
                                    <div className="notification-time">Hace 1 hora</div>
                                </div>
                                {isUnread(2) && <div className="notification-unread"></div>}
                            </div>
                        </div>
                        <div className="dropdown-footer">
                            <a href="#" onClick={viewAllNotifications}>Ver todas las notificaciones</a>
                        </div>
                    </div>
                </div>

                {/* Menú de usuario */}
                <div ref={userMenuRef}>
                    <div className="profile-btn" onClick={toggleUserMenu}>
                        <div className="profile-avatar">JD</div>
                        <div className="profile-info">Juan</div>
                        <FontAwesomeIcon icon={faChevronDown} className="profile-caret"/>
                    </div>

                    {/* Menú desplegable de usuario */}
                    <div className={`user-menu ${!showUserMenu ? 'hidden' : ''}`}>
                        <div className="user-header">
                            <div className="user-header-avatar">JD</div>
                            <div className="user-header-name">Juan Doe</div>
                            <div className="user-header-email">juan.doe@ejemplo.com</div>
                        </div>
                        <div className="user-menu-items">
                            <a href="#" className="user-menu-item">
                                <FontAwesomeIcon icon={faUser}/>
                                Mi Perfil
                            </a>
                            <a href="#" className="user-menu-item">
                                <FontAwesomeIcon icon={faEnvelope}/>
                                Mensajes
                            </a>
                            <a href="#" className="user-menu-item">
                                <FontAwesomeIcon icon={faClipboardList}/>
                                Actividad
                            </a>
                            <a href="#" className="user-menu-item">
                                <FontAwesomeIcon icon={faCog}/>
                                Configuración
                            </a>
                            <div className="user-menu-divider"></div>
                            <a href="#" className="user-menu-item logout">
                                <FontAwesomeIcon icon={faSignOutAlt}/>
                                Cerrar Sesión
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ventana emergente */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-container" ref={popupRef}>
                        <div className="popup-header">
                            <h3>Notificaciones</h3>
                            <button className="popup-close" onClick={closePopup}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <div className="popup-content">
                            <div className="popup-message">
                                <FontAwesomeIcon icon={faInfoCircle} className="popup-icon" />
                                <p>No hay más notificaciones disponibles en este momento.</p>
                            </div>
                        </div>
                        <div className="popup-footer">
                            <button className="popup-button" onClick={closePopup}>Aceptar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Topbar;