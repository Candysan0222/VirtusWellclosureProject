import React from 'react';
import { ResponsiveContainer } from 'recharts';

interface HeatmapChartProps {
    data?: Array<any>;
    title?: string;
}

const HeatmapChart: React.FC<HeatmapChartProps> = ({
                                                       data,
                                                       title = "Gráfico de mapa de calor (datos semanales)"
                                                   }) => {
    // Datos de ejemplo para la semana si no se proporcionan
    const defaultData = [
        { day: 'Lunes', hour0: 12, hour1: 18, hour2: 15, hour3: 10, hour4: 8, hour5: 12, hour6: 25,
            hour7: 35, hour8: 50, hour9: 60, hour10: 75, hour11: 80,
            hour12: 85, hour13: 82, hour14: 75, hour15: 65, hour16: 55, hour17: 58,
            hour18: 62, hour19: 55, hour20: 40, hour21: 30, hour22: 20, hour23: 15
        },
        { day: 'Martes', hour0: 10, hour1: 8, hour2: 5, hour3: 5, hour4: 7, hour5: 10, hour6: 20,
            hour7: 38, hour8: 60, hour9: 65, hour10: 70, hour11: 72,
            hour12: 70, hour13: 68, hour14: 65, hour15: 60, hour16: 58, hour17: 65,
            hour18: 70, hour19: 60, hour20: 45, hour21: 32, hour22: 22, hour23: 15
        },
        { day: 'Miércoles', hour0: 15, hour1: 12, hour2: 8, hour3: 8, hour4: 10, hour5: 15, hour6: 22,
            hour7: 40, hour8: 65, hour9: 75, hour10: 85, hour11: 90,
            hour12: 88, hour13: 85, hour14: 80, hour15: 75, hour16: 72, hour17: 75,
            hour18: 80, hour19: 70, hour20: 55, hour21: 42, hour22: 30, hour23: 20
        },
        { day: 'Jueves', hour0: 18, hour1: 15, hour2: 12, hour3: 10, hour4: 12, hour5: 15, hour6: 25,
            hour7: 42, hour8: 62, hour9: 72, hour10: 80, hour11: 85,
            hour12: 82, hour13: 80, hour14: 75, hour15: 70, hour16: 68, hour17: 70,
            hour18: 75, hour19: 65, hour20: 50, hour21: 38, hour22: 25, hour23: 20
        },
        { day: 'Viernes', hour0: 20, hour1: 18, hour2: 15, hour3: 12, hour4: 15, hour5: 20, hour6: 30,
            hour7: 45, hour8: 68, hour9: 78, hour10: 85, hour11: 90,
            hour12: 95, hour13: 92, hour14: 88, hour15: 82, hour16: 78, hour17: 80,
            hour18: 85, hour19: 75, hour20: 60, hour21: 48, hour22: 35, hour23: 25
        },
        { day: 'Sábado', hour0: 22, hour1: 20, hour2: 18, hour3: 15, hour4: 18, hour5: 22, hour6: 25,
            hour7: 35, hour8: 45, hour9: 55, hour10: 65, hour11: 75,
            hour12: 80, hour13: 85, hour14: 90, hour15: 95, hour16: 98, hour17: 95,
            hour18: 90, hour19: 80, hour20: 65, hour21: 52, hour22: 42, hour23: 30
        },
        { day: 'Domingo', hour0: 25, hour1: 22, hour2: 20, hour3: 18, hour4: 20, hour5: 22, hour6: 20,
            hour7: 25, hour8: 30, hour9: 40, hour10: 50, hour11: 60,
            hour12: 70, hour13: 75, hour14: 80, hour15: 85, hour16: 88, hour17: 85,
            hour18: 80, hour19: 70, hour20: 55, hour21: 45, hour22: 35, hour23: 28
        },
    ];

    const chartData = data || defaultData;

    // Horas del día (para el encabezado)
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    // Escala de colores
    const getColor = (value: number) => {
        // Función para convertir valor a color (0-100 a escala de verde a rojo)
        if (value < 30) return '#4ade80'; // Verde claro
        if (value < 50) return '#a3e635'; // Lima
        if (value < 65) return '#facc15'; // Amarillo
        if (value < 80) return '#fb923c'; // Naranja
        return '#ef4444'; // Rojo
    };

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div style={{
                flex: 1,
                minHeight: '200px',
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px repeat(24, minmax(30px, 1fr))',
                    fontSize: '10px',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#fff',
                    zIndex: 1,
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <div style={{
                        padding: '4px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        borderRight: '1px solid #e5e7eb'
                    }}>
                        Día / Hora
                    </div>
                    {hours.map((hour, idx) => (
                        <div key={idx} style={{
                            padding: '4px',
                            textAlign: 'center',
                            borderRight: idx < 23 ? '1px solid #e5e7eb' : 'none'
                        }}>
                            {hour}
                        </div>
                    ))}
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px repeat(24, minmax(30px, 1fr))',
                    fontSize: '10px',
                    flex: 1
                }}>
                    {chartData.map((dayData, dayIdx) => (
                        <React.Fragment key={dayIdx}>
                            <div style={{
                                padding: '4px',
                                fontWeight: 'bold',
                                borderBottom: dayIdx < chartData.length - 1 ? '1px solid #e5e7eb' : 'none',
                                borderRight: '1px solid #e5e7eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {dayData.day}
                            </div>

                            {hours.map((_, hourIdx) => {
                                const value = dayData[`hour${hourIdx}`];
                                return (
                                    <div
                                        key={hourIdx}
                                        style={{
                                            backgroundColor: getColor(value),
                                            borderBottom: dayIdx < chartData.length - 1 ? '1px solid #e5e7eb' : 'none',
                                            borderRight: hourIdx < 23 ? '1px solid #e5e7eb' : 'none',
                                            position: 'relative',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: value > 50 ? 'white' : 'black',
                                            fontWeight: 'bold'
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

            <div style={{
                marginTop: '8px',
                fontSize: '12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
            }}>
                <span>Intensidad:</span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
          <span style={{
              width: '15px',
              height: '15px',
              backgroundColor: '#4ade80',
              display: 'inline-block',
              borderRadius: '2px'
          }}></span>
                    <span>Baja</span>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
          <span style={{
              width: '15px',
              height: '15px',
              backgroundColor: '#facc15',
              display: 'inline-block',
              borderRadius: '2px'
          }}></span>
                    <span>Media</span>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                }}>
          <span style={{
              width: '15px',
              height: '15px',
              backgroundColor: '#ef4444',
              display: 'inline-block',
              borderRadius: '2px'
          }}></span>
                    <span>Alta</span>
                </div>
            </div>
        </div>
    );
};

export default HeatmapChart;