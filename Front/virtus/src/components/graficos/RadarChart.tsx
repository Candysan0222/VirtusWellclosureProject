import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

interface RadarChartComponentProps {
    data?: Array<any>;
    title?: string;
}

const RadarChartComponent: React.FC<RadarChartComponentProps> = ({
                                                                     data,
                                                                     title = ""
                                                                 }) => {
    // Datos de ejemplo quincenales si no se proporcionan
    const defaultData = [
        { categoria: 'Calidad del Aire', primeraQuincena: 65, segundaQuincena: 72 },
        { categoria: 'Nivel de Ruido', primeraQuincena: 78, segundaQuincena: 70 },
        { categoria: 'Calidad del Agua', primeraQuincena: 85, segundaQuincena: 82 },
        { categoria: 'Espacios Verdes', primeraQuincena: 60, segundaQuincena: 68 },
        { categoria: 'Gestión de Residuos', primeraQuincena: 70, segundaQuincena: 75 },
        { categoria: 'Energía Renovable', primeraQuincena: 55, segundaQuincena: 62 },
        { categoria: 'Transporte Público', primeraQuincena: 80, segundaQuincena: 78 },
    ];

    const chartData = data || defaultData;

    // Colores para las series de datos
    const firstColor = '#3b82f6'; // Azul
    const secondColor = '#ef4444'; // Rojo

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div style={{ flex: 1, minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                        <PolarGrid gridType="polygon" />
                        <PolarAngleAxis
                            dataKey="categoria"
                            tick={{ fontSize: 10, fill: '#4b5563' }}
                            tickLine={false}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={{ fontSize: 10 }}
                            tickCount={5}
                            axisLine={false}
                        />

                        <Radar
                            name="Primera Quincena"
                            dataKey="primeraQuincena"
                            stroke={firstColor}
                            fill={firstColor}
                            fillOpacity={0.5}
                            dot
                            isAnimationActive={true}
                        />
                        <Radar
                            name="Segunda Quincena"
                            dataKey="segundaQuincena"
                            stroke={secondColor}
                            fill={secondColor}
                            fillOpacity={0.5}
                            dot
                            isAnimationActive={true}
                        />

                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '12px',
                            }}
                            formatter={(value) => [`${value}%`, ``]}
                        />

                        <Legend
                            wrapperStyle={{ fontSize: '12px', marginTop: '10px' }}
                            layout="horizontal"
                            verticalAlign="bottom"
                            align="center"
                            iconSize={10}
                            iconType="circle"
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#6b7280',
                textAlign: 'center'
            }}>
                Comparativa quincenal de indicadores ambientales (valores en %)
            </div>

            {/* Añadimos un resumen de métricas */}
            <div style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-around',
                fontSize: '12px',
                flexWrap: 'wrap'
            }}>
                {chartData.map((item, index) => {
                    const diff = item.segundaQuincena - item.primeraQuincena;
                    const isImproved = diff > 0;

                    return (
                        <div key={index} style={{
                            display: index < 3 ? 'flex' : 'none', // Solo mostramos las 3 primeras para no ocupar demasiado espacio
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: '#f9fafb',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            margin: '4px'
                        }}>
                            <span style={{ fontWeight: 'bold', fontSize: '10px' }}>{item.categoria}</span>
                            <span style={{
                                color: isImproved ? '#10b981' : '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2px',
                                fontSize: '10px'
                            }}>
                                {isImproved ? '▲' : '▼'} {Math.abs(diff)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default RadarChartComponent;