import React, { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface RealTimeLineChartProps {
    initialData?: Array<any>;
    title?: string;
    maxDataPoints?: number;
}

const RealTimeLineChart: React.FC<RealTimeLineChartProps> = ({
                                                                 initialData,
                                                                 title = "Gráfico de líneas en tiempo real",
                                                                 maxDataPoints = 20
                                                             }) => {
    // Datos iniciales si no se proporcionan
    const defaultData = Array.from({ length: 10 }, (_, index) => ({
        time: new Date(Date.now() - (9 - index) * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        value1: Math.floor(Math.random() * 40) + 30,
        value2: Math.floor(Math.random() * 50) + 20
    }));

    // Estado para los datos del gráfico
    const [data, setData] = useState(initialData || defaultData);
    // Estado para almacenar el intervalo
    const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
    // Estado para controlar si el gráfico está en pausa
    const [isPaused, setIsPaused] = useState(false);

    // Función para actualizar los datos con nuevos puntos
    const updateData = () => {
        setData(prevData => {
            const newData = [...prevData];
            const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const newValue1 = Math.floor(Math.random() * 40) + 30;
            const newValue2 = Math.floor(Math.random() * 50) + 20;

            // Agregar nuevo punto de datos
            newData.push({ time: newTime, value1: newValue1, value2: newValue2 });

            // Limitar el número de puntos de datos para que no crezca infinitamente
            if (newData.length > maxDataPoints) {
                return newData.slice(newData.length - maxDataPoints);
            }

            return newData;
        });
    };

    // Iniciar/detener la actualización de datos
    const togglePause = () => {
        if (isPaused) {
            // Reanudar la actualización
            const id = setInterval(updateData, 1000);
            setIntervalId(id);
        } else {
            // Pausar la actualización
            if (intervalId) {
                clearInterval(intervalId);
                setIntervalId(null);
            }
        }
        setIsPaused(!isPaused);
    };

    // Efecto para iniciar la actualización automática de datos
    useEffect(() => {
        // Comenzar a actualizar los datos cada segundo
        const id = setInterval(updateData, 1000);
        setIntervalId(id);

        // Limpiar el intervalo al desmontar el componente
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, []); // Array de dependencias vacío para que solo se ejecute una vez al montar

    // Calcular los valores promedio para las líneas de referencia
    const average1 = data.reduce((sum, item) => sum + item.value1, 0) / data.length;
    const average2 = data.reduce((sum, item) => sum + item.value2, 0) / data.length;

    // Definimos colores para las series
    const color1 = '#3b82f6'; // Azul
    const color2 = '#ef4444'; // Rojo

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
            }}>
                <h3 className="text-lg font-medium">{title}</h3>
                <button
                    onClick={togglePause}
                    style={{
                        backgroundColor: isPaused ? '#10b981' : '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        fontSize: '12px',
                        cursor: 'pointer'
                    }}
                >
                    {isPaused ? 'Reanudar' : 'Pausar'}
                </button>
            </div>

            <div style={{ flex: 1, minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="time"
                            tick={{ fontSize: 10 }}
                            tickCount={5}
                        />
                        <YAxis tick={{ fontSize: 10 }} />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '12px',
                            }}
                        />

                        <Legend
                            wrapperStyle={{ fontSize: '12px' }}
                            iconSize={10}
                            verticalAlign="top"
                        />

                        {/* Líneas de referencia para promedios */}
                        <ReferenceLine
                            y={average1}
                            stroke={color1}
                            strokeDasharray="3 3"
                            strokeOpacity={0.6}
                            label={{
                                value: `Prom: ${average1.toFixed(1)}`,
                                position: 'insideBottomRight',
                                fill: color1,
                                fontSize: 10
                            }}
                        />

                        <ReferenceLine
                            y={average2}
                            stroke={color2}
                            strokeDasharray="3 3"
                            strokeOpacity={0.6}
                            label={{
                                value: `Prom: ${average2.toFixed(1)}`,
                                position: 'insideTopRight',
                                fill: color2,
                                fontSize: 10
                            }}
                        />

                        <Line
                            type="monotone"
                            dataKey="value1"
                            stroke={color1}
                            activeDot={{ r: 4 }}
                            dot={{ r: 2 }}
                            name="Sensor 1"
                            isAnimationActive={false} // Desactivar animación para datos en tiempo real
                        />

                        <Line
                            type="monotone"
                            dataKey="value2"
                            stroke={color2}
                            activeDot={{ r: 4 }}
                            dot={{ r: 2 }}
                            name="Sensor 2"
                            isAnimationActive={false} // Desactivar animación para datos en tiempo real
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#6b7280'
            }}>
                <div>
                    Actualización: {isPaused ? 'En pausa' : 'Tiempo real (1s)'}
                </div>
                <div>
                    Último valor Sensor 1: <span style={{ fontWeight: 'bold', color: color1 }}>{data[data.length - 1]?.value1 || 'N/A'}</span>
                </div>
                <div>
                    Último valor Sensor 2: <span style={{ fontWeight: 'bold', color: color2 }}>{data[data.length - 1]?.value2 || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
};

export default RealTimeLineChart;