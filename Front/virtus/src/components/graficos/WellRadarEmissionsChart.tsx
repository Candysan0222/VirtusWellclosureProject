import React, { useState, useEffect, useRef } from 'react';
import { Radar } from 'recharts';
import {
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Legend,
    Tooltip
} from 'recharts';
import './WellRadarEmissionsChart.css';

// Datos de muestra para los pozos
const wellsData = [
    {
        wellCode: 'VW-001',
        phData: {
            before: 7.2,
            during: 6.8,
            after: 7.5
        }
    },
    {
        wellCode: 'VW-002',
        phData: {
            before: 7.8,
            during: 6.5,
            after: 7.1
        }
    },
    {
        wellCode: 'VW-003',
        phData: {
            before: 6.9,
            during: 6.2,
            after: 7.4
        }
    },
    {
        wellCode: 'VW-004',
        phData: {
            before: 7.5,
            during: 6.7,
            after: 7.3
        }
    },
    {
        wellCode: 'VW-005',
        phData: {
            before: 7.1,
            during: 6.4,
            after: 7.6
        }
    },
    {
        wellCode: 'VW-006',
        phData: {
            before: 7.4,
            during: 6.6,
            after: 7.2
        }
    },
    {
        wellCode: 'VW-007',
        phData: {
            before: 7.3,
            during: 6.9,
            after: 7.7
        }
    },
    {
        wellCode: 'VW-008',
        phData: {
            before: 7.6,
            during: 6.3,
            after: 7.0
        }
    }
];

// Formato de datos para el gráfico de radar
const formatDataForRadarChart = (wellData) => {
    return [
        { subject: 'Antes del Abandono', A: wellData.phData.before, fullMark: 14 },
        { subject: 'Durante el Abandono', A: wellData.phData.during, fullMark: 14 },
        { subject: 'Después del Abandono', A: wellData.phData.after, fullMark: 14 }
    ];
};

const WellRadarEmissionsChart = () => {
    const containerRef = useRef(null);
    const [currentWellIndex, setCurrentWellIndex] = useState(0);
    const [currentWell, setCurrentWell] = useState(wellsData[0]);
    const [chartData, setChartData] = useState(formatDataForRadarChart(wellsData[0]));
    const [chartSize, setChartSize] = useState({ width: '100%', height: 400 });
    const [shouldShowVerticalTitle, setShouldShowVerticalTitle] = useState(true);

    // Función para actualizar el tamaño del gráfico según el tamaño de la ventana
    const updateChartSize = () => {
        const width = window.innerWidth;
        if (width < 576) { // Móviles
            setChartSize({ width: '100%', height: 300 });
            setShouldShowVerticalTitle(false);
        } else if (width < 992) { // Tablets
            setChartSize({ width: '100%', height: 350 });
            setShouldShowVerticalTitle(true);
        } else { // Escritorio
            setChartSize({ width: '100%', height: 400 });
            setShouldShowVerticalTitle(true);
        }
    };

    // Efecto para cambiar de pozo cada 10 segundos
    useEffect(() => {
        const timer = setInterval(() => {
            const nextIndex = (currentWellIndex + 1) % wellsData.length;
            setCurrentWellIndex(nextIndex);
            setCurrentWell(wellsData[nextIndex]);
            setChartData(formatDataForRadarChart(wellsData[nextIndex]));
        }, 10000);

        // Limpiar el temporizador cuando el componente se desmonte
        return () => clearInterval(timer);
    }, [currentWellIndex]);

    // Efecto para actualizar el tamaño del gráfico cuando cambia el tamaño de la ventana
    useEffect(() => {
        // Llamada inicial para establecer el tamaño correcto
        updateChartSize();
        // Agregar event listener para cambios de tamaño de ventana
        window.addEventListener('resize', updateChartSize);

        // Limpiar el event listener cuando el componente se desmonte
        return () => window.removeEventListener('resize', updateChartSize);
    }, []);

    // Colores para el gráfico
    const chartColors = {
        grid: '#e0e0e0',
        primary: '#526c17',
        text: '#333333',
        background: '#f8f9fa'
    };

    // Dominio para el eje de pH (típicamente entre 0 y 14)
    const phDomain = [0, 14];

    return (
        <div className="radar-chart-container" ref={containerRef} style={{ width: chartSize.width, height: chartSize.height }}>
            {/* Eliminar el título central y mostrar solo el código en la esquina superior izquierda */}
            <div className="well-code">
                <h3>{currentWell.wellCode}</h3>
            </div>

            {shouldShowVerticalTitle && (
                <div className="vertical-title">Emisión de gases y contaminantes</div>
            )}

            <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={chartData}
                    className="ph-radar-chart"
                >
                    <PolarGrid stroke={chartColors.grid} />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: chartColors.text, fontSize: '12px' }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={phDomain}
                        tick={{ fill: chartColors.text, fontSize: '12px' }}
                    />
                    <Radar
                        name="pH del Agua"
                        dataKey="A"
                        stroke={chartColors.primary}
                        fill={chartColors.primary}
                        fillOpacity={0.6}
                    />
                    <Tooltip
                        formatter={(value) => [`pH: ${value}`, 'Valor']}
                        labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                </RadarChart>
            </ResponsiveContainer>

            <div className="chart-footer">
            </div>
        </div>
    );
};

export default WellRadarEmissionsChart;