'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import './EmissionsRadarChart.css';

// Tipos de emisiones que mostraremos
const emissionTypes = [
    { name: 'CO2', fullName: 'Emisión de CO2', unit: 'ppm' },
    { name: 'CH4', fullName: 'Emisión de CH4', unit: 'ppm' },
    { name: 'SOx', fullName: 'Compuestos de Azufre (SOx)', unit: 'ppm' },
    { name: 'NOx', fullName: 'Óxidos de Nitrógeno (NOx)', unit: 'ppm' },
    { name: 'PM', fullName: 'Partículas Suspendidas (PM10, PM2.5)', unit: 'μg/m3' }
];

// Simulación de nombres de pozos
const wellNames = [
    'VW-01',
    'VW-02',
    'VW-03',
    'VW-04',
    'VW-05',
    'VW-06',
    'VW-07'
];

// Interfaz para los datos de emisión
interface EmissionData {
    subject: string;
    fullName: string;
    unit: string;
    antes: number;
    durante: number;
    despues: number;
}

interface EmissionMeasurement {
    wellName: string;
    data: EmissionData[];
}

// Función para generar datos aleatorios para un pozo
const generateRandomEmissionData = (wellName: string): EmissionMeasurement => {
    return {
        wellName,
        data: emissionTypes.map(type => ({
            subject: type.name,
            fullName: type.fullName,
            unit: type.unit,
            antes: Math.floor(Math.random() * 500),
            durante: Math.floor(Math.random() * 800),
            despues: Math.floor(Math.random() * 300)
        }))
    };
};

// Genera datos para todos los pozos
const generateAllWellsData = (): EmissionMeasurement[] => {
    return wellNames.map(wellName => generateRandomEmissionData(wellName));
};

const EmissionsRadarChart = () => {
    // Datos para todos los pozos
    const [allWellsData] = useState<EmissionMeasurement[]>(generateAllWellsData());
    // Pozo actual que se está mostrando
    const [currentWellIndex, setCurrentWellIndex] = useState(0);
    // Datos del pozo actual
    const [currentWellData, setCurrentWellData] = useState<EmissionData[]>(allWellsData[0].data);
    // Nombre del pozo actual
    const [currentWellName, setCurrentWellName] = useState<string>(allWellsData[0].wellName);

    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // Detecta cambios en el tamaño del contenedor
    useEffect(() => {
        const updateDimensions = () => {
            if (chartContainerRef.current) {
                const { clientWidth, clientHeight } = chartContainerRef.current;
                setContainerWidth(clientWidth);
                setContainerHeight(clientHeight);
            }
        };

        // Inicialización
        updateDimensions();

        // Detector de cambios de tamaño
        const resizeObserver = new ResizeObserver(updateDimensions);

        if (chartContainerRef.current) {
            resizeObserver.observe(chartContainerRef.current);
        }

        // Limpieza
        return () => {
            if (chartContainerRef.current) {
                resizeObserver.unobserve(chartContainerRef.current);
            }
        };
    }, []);

    // Cambia el pozo actual cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWellIndex((prevIndex) => {
                const newIndex = (prevIndex + 1) % allWellsData.length;
                setCurrentWellData(allWellsData[newIndex].data);
                setCurrentWellName(allWellsData[newIndex].wellName);
                return newIndex;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [allWellsData]);

    // Determina si debe mostrar el título vertical
    const shouldShowVerticalTitle = containerWidth > 575;

    // Valores óptimos para maximizar el círculo del gráfico
    const getOuterRadius = () => {
        // Usando porcentajes más altos para que el círculo sea más grande
        if (containerWidth < 400) return "90%";  // Muy grande para móviles
        if (containerWidth < 600) return "85%";  // Grande para tablets pequeñas
        return "80%";                           // Para pantallas más grandes
    };

    // Minimiza los márgenes para dar más espacio al círculo
    const getMargins = () => {
        if (containerWidth < 400) {
            return { top: 5, right: 5, bottom: 5, left: 5 };
        }
        if (containerWidth < 600) {
            return { top: 10, right: 10, bottom: 10, left: 10 };
        }
        return { top: 15, right: 15, bottom: 15, left: 15 };
    };

    // Componente personalizado para las etiquetas del eje angular (nombres como CO2, CH4)
    const CustomizedAxisTick = (props: any) => {
        const { x, y, cx, cy, payload } = props;

        // Calculamos el ángulo para posicionar adecuadamente la etiqueta
        const radius = Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2));
        // Calculamos un nuevo radio más alejado para las etiquetas de categorías
        const newRadius = radius * 1.15; // 15% más alejado que el radio original

        // Calculamos las nuevas coordenadas
        const angle = Math.atan2(y - cy, x - cx);
        const newX = cx + newRadius * Math.cos(angle);
        const newY = cy + newRadius * Math.sin(angle);

        return (
            <g transform={`translate(${newX},${newY})`}>
                <text
                    x={0}
                    y={0}
                    dy={0}
                    textAnchor="middle"
                    fill="#555"
                    fontSize={containerWidth < 500 ? 9 : 11}
                    fontWeight="bold"
                >
                    {payload.value}
                </text>
            </g>
        );
    };

    // Componente personalizado para los valores numéricos
    const CustomizedRadiusAxisTick = (props: any) => {
        const { x, y, payload } = props;

        return (
            <g transform={`translate(${x},${y})`}>
                <text
                    x={0}
                    y={0}
                    dy={-5} // Desplazamos hacia arriba para separar del exterior
                    textAnchor="middle"
                    fill="#666"
                    fontSize={containerWidth < 500 ? 9 : 11}
                >
                    {payload.value}
                </text>
            </g>
        );
    };

    return (
        <div ref={chartContainerRef} className="radar-chart-container">
            {shouldShowVerticalTitle && (
                <div className="vertical-title">Emisión de gases y contaminantes</div>
            )}
            <div className="well-name well-name-top">{currentWellName}</div>

            <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                        outerRadius={getOuterRadius()}
                        data={currentWellData}
                        margin={getMargins()}
                    >
                        <PolarGrid gridType="circle" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={CustomizedAxisTick} // Usamos el componente personalizado
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 'auto']}
                            tick={CustomizedRadiusAxisTick} // Usamos el componente personalizado
                            tickCount={4}
                        />

                        <Radar
                            name="Antes del Abandono"
                            dataKey="antes"
                            stroke="#1f77b4"
                            fill="#1f77b4"
                            fillOpacity={0.5}
                            strokeWidth={2}
                            className="radar-area"
                        />

                        <Radar
                            name="Durante el Abandono"
                            dataKey="durante"
                            stroke="#ff7f0e"
                            fill="#ff7f0e"
                            fillOpacity={0.5}
                            strokeWidth={2}
                            className="radar-area"
                        />

                        <Radar
                            name="Después del Abandono"
                            dataKey="despues"
                            stroke="#2ca02c"
                            fill="#2ca02c"
                            fillOpacity={0.5}
                            strokeWidth={2}
                            className="radar-area"
                        />

                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                        <div className="custom-tooltip">
                                            <p className="tooltip-title">{data.fullName}</p>
                                            <p className="tooltip-unit">Unidad: {data.unit}</p>
                                            {payload.map((entry, index) => (
                                                <p key={index} className="tooltip-item" style={{ color: entry.color }}>
                                                    {entry.name}: {entry.value} {data.unit}
                                                </p>
                                            ))}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Legend
                            verticalAlign="bottom"
                            align="center"
                            layout="horizontal"
                            wrapperStyle={{
                                fontSize: containerWidth < 500 ? '8px' : '10px',
                                lineHeight: '12px',
                                padding: '0',
                                margin: '0',
                                bottom: '-5px'
                            }}
                            iconSize={8}
                            iconType="circle"
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="bottom-note">
                Los datos se actualizan automáticamente cada 5 segundos
            </div>
        </div>
    );
};

export default EmissionsRadarChart;