'use client';

import React, { useEffect, useState, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import './RadarChart.css';

// Simulación de nombres de pozos
const wellNames = Array.from({ length: 15 }, (_, i) => `# ${i + 1}`);

interface WellPressure {
    name: string;
    psi: number;
}

const generateRandomPressure = (): number => {
    return Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000; // Presión entre 1000 y 5000 PSI
};

const generatePressureData = (): WellPressure[] => {
    return wellNames.map(name => ({
        name,
        psi: generateRandomPressure(),
    }));
};

const RadarChart = () => {
    const [data, setData] = useState<WellPressure[]>(generatePressureData());
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const chartContainerRef = useRef<HTMLDivElement>(null);

    // Actualiza los datos aleatorios cada 3 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setData(generatePressureData());
        }, 3000);

        return () => clearInterval(interval);
    }, []);

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

    // Ajuste dinámico de ángulo y tamaño según el ancho
    const getXAxisProps = () => {
        // Si el contenedor es estrecho, aumentamos el ángulo y reducimos espacio
        if (containerWidth < 500) {
            return {
                angle: -65,
                height: 60,
                offset: -15,
                fontSize: 'small',
                interval: 1, // Mostrar cada segundo punto en pantallas pequeñas
            };
        } else if (containerWidth < 800) {
            return {
                angle: -55,
                height: 50,
                offset: -15,
                fontSize: 'medium',
                interval: 0,
            };
        } else {
            return {
                angle: -45,
                height: 40,
                offset: -10,
                fontSize: 'large',
                interval: 0,
            };
        }
    };

    const xAxisProps = getXAxisProps();

    // Calcular aspect ratio basado en el ancho y alto del contenedor
    const getAspectRatio = () => {
        // Si no tenemos dimensiones, usamos un valor por defecto
        if (!containerWidth || !containerHeight) {
            return containerWidth < 500 ? 1.2 : containerWidth < 800 ? 1.6 : 2.5;
        }

        // Si el contenedor es más alto que ancho, ajustamos el aspect ratio
        if (containerHeight > containerWidth) {
            return 0.8; // Para contenedores verticales
        }

        // Para contenedores horizontales
        if (containerWidth < 500) return 1.2; // Más alto que ancho en móviles
        if (containerWidth < 800) return 1.6; // Proporción moderada en tablets
        return 2.2; // Proporción para pantallas grandes
    };

    // Determina el layout de la leyenda
    const getLegendLayout = () => {
        return containerWidth < 600 ? 'vertical' : 'horizontal';
    };

    return (
        <div ref={chartContainerRef} className="chart-container">

            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 20,
                        left: containerWidth < 400 ? 10 : 20,
                        bottom: containerWidth < 500 ? 70 : 40
                    }}
                    className="line-chart"
                >
                    <CartesianGrid strokeDasharray="3 3" className="chart-grid" />

                    <XAxis
                        dataKey="name"
                        interval={xAxisProps.interval}
                        angle={xAxisProps.angle}
                        textAnchor="end"
                        height={xAxisProps.height}
                        tickFormatter={(name, index) => `${index + 1}`}
                        label={{
                            value: 'Pozos',
                            position: 'insideBottom',
                            offset: xAxisProps.offset,
                            className: `axis-label x-axis-label font-size-${xAxisProps.fontSize}`
                        }}
                        tick={{ className: `axis-tick x-axis-tick font-size-${xAxisProps.fontSize}` }}
                        className="x-axis"
                    />

                    <YAxis
                        domain={[0, 6000]}
                        label={{
                            value: 'Presión (PSI)',
                            angle: -90,
                            position: 'insideLeft',
                            offset: containerWidth < 500 ? -5 : -10,
                            className: containerWidth < 500 ? 'axis-label y-axis-label font-size-small' : 'axis-label y-axis-label font-size-large'
                        }}
                        tick={{ className: containerWidth < 500 ? 'axis-tick y-axis-tick font-size-small' : 'axis-tick y-axis-tick font-size-large' }}
                        width={containerWidth < 500 ? 40 : 60}
                        className="y-axis"
                        tickCount={containerWidth < 500 ? 5 : 6}
                    />

                    <Tooltip
                        contentStyle={{
                            fontSize: containerWidth < 500 ? '12px' : '14px',
                            padding: '8px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: '1px solid #ddd',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value: any) => [`${value} PSI`, 'Presión']}
                    />

                    <Legend
                        verticalAlign="top"
                        height={36}
                        layout={getLegendLayout()}
                        wrapperStyle={{
                            fontSize: containerWidth < 500 ? '10px' : '12px',
                            marginTop: '5px'
                        }}
                        className={containerWidth < 500 ? 'chart-legend font-size-small' : 'chart-legend font-size-large'}
                    />

                    {/* Línea principal de presión */}
                    <Line
                        type="monotone"
                        dataKey="psi"
                        className={containerWidth < 500 ? 'pressure-line pressure-line-small' : 'pressure-line pressure-line-large'}
                        activeDot={{ r: containerWidth < 500 ? 4 : 6, className: 'active-dot' }}
                        name="Presión PSI"
                        connectNulls={true}
                    />

                    {/* Líneas verticales grises indicando cada pozo */}
                    {data.map((entry, index) => (
                        <ReferenceLine
                            key={index}
                            x={entry.name}
                            className={containerWidth < 500 ? 'reference-line reference-line-small' : 'reference-line reference-line-large'}
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default RadarChart;