import React from 'react';
import { useNavigate } from 'react-router-dom';

// Estilos CSS en línea como objeto
const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
    },
    title: {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    },
    grid: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '20px',
    },
    column: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60px',
        padding: '10px 15px',
        backgroundColor: 'white',
        border: '2px solid #4dabf7',
        borderRadius: '25px',
        color: '#1c7ed6',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        outline: 'none',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    }
};

// Interfaces
interface FormatoButtonProps {
    number: number;
    label: string;
    onClick: () => void;
}

interface FormatoGridProps {
    onFormatoClick?: (formatoNumber: number) => void;
}

// Botón individual para formatos
const FormatoButton: React.FC<FormatoButtonProps> = ({ number, label, onClick }) => {
    return (
        <button
            style={styles.button as React.CSSProperties}
            onClick={onClick}
        >
            {label}
        </button>
    );
};

// Componente de cuadrícula principal
const FormatoGrid: React.FC<FormatoGridProps> = ({ onFormatoClick }) => {
    const navigate = useNavigate();

    const handleFormatoClick = (formatoNumber: number) => {
        // Si se proporcionó una función de callback, la usamos
        if (onFormatoClick) {
            onFormatoClick(formatoNumber);
            return;
        }

        // De lo contrario, usamos la navegación predeterminada
        // Define las rutas para cada formato
        switch(formatoNumber) {
            case 1:
                navigate('/formato/home');
                break;
            case 2:
                navigate('/formato/perforacion');
                break;
            case 3:
                navigate('/formato/ambiental');
                break;
            case 4:
                navigate('/formato/mantenimiento');
                break;
            case 5:
                navigate('/formato/seguridad');
                break;
            case 6:
                navigate('/formato/calidad');
                break;
            case 7:
                navigate('/formato/logistica');
                break;
            case 8:
                navigate('/formato/recursos-humanos');
                break;
            case 9:
                navigate('/formato/finanzas');
                break;
            case 10:
                navigate('/formato/administracion');
                break;
            default:
                navigate(`/formato/${formatoNumber}`);
        }
    };

    // Definir los formatos con sus etiquetas
    const formatos = [
        { number: 1, label: 'Home' },
        { number: 2, label: 'Perforación' },
        { number: 3, label: 'Ambiental' },
        { number: 4, label: 'Mantenimiento' },
        { number: 5, label: 'Seguridad' },
        { number: 6, label: 'Calidad' },
        { number: 7, label: 'Logística' },
        { number: 8, label: 'Recursos Humanos' },
        { number: 9, label: 'Finanzas' },
        { number: 10, label: 'Administración' }
    ];

    // Generar arrays para las dos columnas
    const leftColumnFormats = formatos.slice(0, 5);
    const rightColumnFormats = formatos.slice(5, 10);

    return (
        <div style={styles.container as React.CSSProperties}>
            <h2 style={styles.title as React.CSSProperties}>Seleccione un Formato</h2>
            <div style={styles.grid as React.CSSProperties}>
                <div style={styles.column as React.CSSProperties}>
                    {leftColumnFormats.map((formato) => (
                        <FormatoButton
                            key={formato.number}
                            number={formato.number}
                            label={formato.label}
                            onClick={() => handleFormatoClick(formato.number)}
                        />
                    ))}
                </div>
                <div style={styles.column as React.CSSProperties}>
                    {rightColumnFormats.map((formato) => (
                        <FormatoButton
                            key={formato.number}
                            number={formato.number}
                            label={formato.label}
                            onClick={() => handleFormatoClick(formato.number)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FormatoGrid;