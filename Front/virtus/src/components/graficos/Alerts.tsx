import React, { useState } from 'react';
import './Alerts.css';

interface Alert {
    id: string;
    title: string;
    value: string;
    unit: string;
    status: string;
    description: string;
    details?: string;
    location?: string;
    sensorId?: string;
}

interface AlertModalProps {
    alert: Alert | null;
    isOpen: boolean;
    onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ alert, isOpen, onClose }) => {
    // El useEffect debe estar antes de cualquier return para evitar el error de las reglas de hooks
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'auto';
            };
        }
    }, [isOpen]);

    if (!isOpen || !alert) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{alert.title}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    <p>{alert.description}</p>
                    <div className="detail-section">
                        <h3>Información Detallada</h3>
                        <p><strong>Valor:</strong> {alert.value} {alert.unit}</p>
                        {alert.location && <p><strong>Ubicación:</strong> {alert.location}</p>}
                        {alert.sensorId && <p><strong>ID Sensor:</strong> {alert.sensorId}</p>}
                        {alert.details && <p>{alert.details}</p>}
                    </div>
                    <div className="modal-footer">
                        <button className="secondary-btn">Ignorar</button>
                        <button className="primary-btn">Atender Alerta</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface AlertBoxProps {
    alert: Alert;
    onClick: (alert: Alert) => void;
}

const AlertBox: React.FC<AlertBoxProps> = ({ alert, onClick }) => {
    return (
        <div
            className="alert-box"
            onClick={() => onClick(alert)}
        >
            <div className={`alert-status status-${alert.status}`}></div>
            <div className="alert-content">
                <div className="alert-title">
                    {alert.title}
                </div>
                <div className="alert-value">
                    <span className="alert-value-number">{alert.value}</span>
                    {alert.unit && <span className="alert-value-unit">{alert.unit}</span>}
                </div>
            </div>
        </div>
    );
};

const Alerts: React.FC = () => {
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const alerts: Alert[] = [
        {
            id: '1',
            title: 'Hidrocarburos en Agua',
            value: '12.5',
            unit: 'mg/L',
            status: 'warning',
            description: 'Nivel elevado de hidrocarburos detectado en agua.',
            details: 'El valor detectado supera el límite recomendado. Verificar fuentes de contaminación.',
            location: 'Estación A-23',
            sensorId: 'WQ-HYD-1205'
        },
        {
            id: '2',
            title: 'Hidrocarburos en Suelo',
            value: '245.8',
            unit: 'mg/Kg',
            status: 'critical',
            description: 'Niveles críticos de hidrocarburos en suelo detectados.',
            details: 'Iniciar protocolo de contención inmediata y aislar el área afectada.',
            location: 'Sector B, Parcela 17',
            sensorId: 'SOIL-HC-3458'
        },
        {
            id: '3',
            title: 'Presión del Sistema',
            value: '147.3',
            unit: 'PSI',
            status: 'critical',
            description: 'La presión ha superado el límite crítico de seguridad.',
            details: 'Activar válvulas de alivio y reducir carga operativa del sistema.',
            location: 'Unidad de Procesamiento 5B',
            sensorId: 'PRES-SYS-8732'
        },
        {
            id: '4',
            title: 'Alerta Sensores IoT',
            value: 'Múltiple',
            unit: '',
            status: 'warning',
            description: 'Anomalías detectadas en múltiples ubicaciones.',
            details: 'Revisar la red de sensores y verificar lecturas en el panel central.',
            location: 'Red Norte',
            sensorId: 'IOT-NET-NORTH'
        },
        {
            id: '5',
            title: 'Alerta 5',
            value: '100',
            unit: 'unidades',
            status: 'normal',
            description: 'Descripción de la alerta 5.',
            location: 'Ubicación 5'
        },
        {
            id: '6',
            title: 'Alerta 6',
            value: '200',
            unit: 'unidades',
            status: 'normal',
            description: 'Descripción de la alerta 6.',
            location: 'Ubicación 6'
        }
    ];

    const openAlertDetails = (alert: Alert) => {
        setSelectedAlert(alert);
        setIsModalOpen(true);
    };

    return (
        <div className="alerts-container">
            <div className="alerts-header">
                <h2>Alertas</h2>
            </div>
            <div className="notifications-section">
                <div className="alerts-grid">
                    {alerts.map((alert) => (
                        <AlertBox key={alert.id} alert={alert} onClick={openAlertDetails} />
                    ))}
                </div>
            </div>

            <AlertModal
                alert={selectedAlert}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default Alerts;