import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faInfoCircle,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './AllNotificationsView.css'; // Necesitarás crear este archivo CSS

const AllNotificationsView: React.FC = () => {
    // En un caso real, estas notificaciones vendrían de una API o store
    const notifications = [
        {
            id: 1,
            title: 'Servidor principal caído',
            message: 'El servidor principal ha dejado de responder. Se ha iniciado el proceso de recuperación.',
            time: 'Hace 5 minutos',
            type: 'danger',
            icon: faExclamationCircle
        },
        {
            id: 2,
            title: 'Pico de tráfico detectado',
            message: 'Se ha detectado un aumento inusual de tráfico en la plataforma.',
            time: 'Hace 30 minutos',
            type: 'warning',
            icon: faInfoCircle
        },
        {
            id: 3,
            title: 'Actualización completada',
            message: 'La actualización del sistema se ha completado correctamente.',
            time: 'Hace 1 hora',
            type: 'success',
            icon: faCheckCircle
        },
        {
            id: 4,
            title: 'Backup automático completado',
            message: 'El backup diario se ha realizado correctamente.',
            time: 'Hace 3 horas',
            type: 'success',
            icon: faCheckCircle
        },
        {
            id: 5,
            title: 'Alerta de seguridad',
            message: 'Se han detectado intentos de acceso no autorizados al sistema.',
            time: 'Hace 1 día',
            type: 'danger',
            icon: faExclamationCircle
        }
    ];

    return (
        <div className="all-notifications-container">
            <div className="notifications-header">
                <h2>Todas las Notificaciones</h2>
                <div className="notifications-actions">
                    <button className="action-button">Marcar todas como leídas</button>
                    <button className="action-button">Filtrar</button>
                </div>
            </div>

            <div className="notifications-list">
                {notifications.map(notification => (
                    <div className="notification-card" key={notification.id}>
                        <div className={`notification-icon ${notification.type}`}>
                            <FontAwesomeIcon icon={notification.icon} />
                        </div>
                        <div className="notification-content">
                            <div className="notification-title">{notification.title}</div>
                            <div className="notification-message">{notification.message}</div>
                            <div className="notification-time">{notification.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllNotificationsView;