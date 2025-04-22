import React from 'react';

interface HeatmapChartProps {
    data?: Array<any>;
    title?: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
                                                       data,
                                                       title = "Mapa de calor semanal"
                                                   }) => {
    // Datos de ejemplo simplificados
    const defaultData = [
        { day: 'Lun', hour0: 12, hour6: 25, hour12: 85, hour18: 62 },
        { day: 'Mar', hour0: 10, hour6: 20, hour12: 70, hour18: 70 },
        { day: 'Mie', hour0: 15, hour6: 22, hour12: 88, hour18: 80 },
        { day: 'Jue', hour0: 18, hour6: 25, hour12: 82, hour18: 75 },
        { day: 'Vie', hour0: 20, hour6: 30, hour12: 95, hour18: 85 },
        { day: 'Sab', hour0: 22, hour6: 25, hour12: 80, hour18: 90 },
        { day: 'Dom', hour0: 25, hour6: 20, hour12: 70, hour18: 80 },
    ];

    const chartData = data || defaultData;

    // Reducción de horas mostradas para simplificar
    const hours = [0, 6, 12, 18].map(h => `${h}:00`);
    const hourKeys = [0, 6, 12, 18].map(h => `hour${h}`);

    // Escala de colores
    const getColor = (value: number) => {
        // Función para convertir valor a color (0-100 a escala de verde a rojo)
        if (value < 30) return '#4ade80'; // Verde claro
        if (value < 50) return '#a3e635'; // Lima
        if (value < 65) return '#facc15'; // Amarillo
        if (value < 80) return '#fb923c'; // Naranja
        return '#ef4444'; // Rojo
    };

    // Estilo de texto adaptativo según el valor del fondo
    const getTextColor = (value: number) => {
        return value > 50 ? 'white' : 'black';
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '30px repeat(4, 1fr)',
                    fontSize: '8px',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div style={{
                        padding: '2px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        borderRight: '1px solid #e5e7eb'
                    }}>
                        Día
                    </div>
                    {hours.map((hour, idx) => (
                        <div key={idx} style={{
                            padding: '2px',
                            textAlign: 'center',
                            borderRight: idx < hours.length - 1 ? '1px solid #e5e7eb' : 'none'
                        }}>
                            {hour}
                        </div>
                    ))}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '30px repeat(4, 1fr)',
                    fontSize: '8px',
                    flex: 1
                }}>
                    {chartData.map((dayData, dayIdx) => (
                        <React.Fragment key={dayIdx}>
                            <div style={{
                                padding: '2px',
                                fontWeight: 'bold',
                                borderBottom: dayIdx < chartData.length - 1 ? '1px solid #e5e7eb' : 'none',
                                borderRight: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {dayData.day}
                            </div>

                            {hourKeys.map((hourKey, hourIdx) => {
                                const value = dayData[hourKey];
                                return (
                                    <div
                                        key={hourIdx}
                                        style={{
                                            backgroundColor: getColor(value),
                                            borderBottom: dayIdx < chartData.length - 1 ? '1px solid #e5e7eb' : 'none',
                                            borderRight: hourIdx < hourKeys.length - 1 ? '1px solid #e5e7eb' : 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: getTextColor(value),
                                            fontWeight: 'bold',
                                            fontSize: '8px',
                                            height: '100%'
                                        }}
                                        title={`${dayData.day} ${hours[hourIdx]}: ${value}`}
                                    >
                                        {value}
                                    </div>
                                );
                            })}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Leyenda simplificada */}
            <div style={{
                marginTop: '2px',
                fontSize: '7px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                flexWrap: 'wrap'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#4ade80', display: 'inline-block', borderRadius: '1px' }}></span>
                    <span>Bajo</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#facc15', display: 'inline-block', borderRadius: '1px' }}></span>
                    <span>Medio</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ width: '8px', height: '8px', backgroundColor: '#ef4444', display: 'inline-block', borderRadius: '1px' }}></span>
                    <span>Alto</span>
                </div>
            </div>
        </div>
    );
};

export default HeatmapChart;