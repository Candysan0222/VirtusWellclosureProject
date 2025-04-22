import React, { useMemo, useState, useEffect } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Line,
    ComposedChart,
    ZAxis
} from 'recharts';

interface ScatterChartComponentProps {
    data?: Array<any>;
    title?: string;
}

const ScatterChartComponent: React.FC<ScatterChartComponentProps> = ({
                                                                         data,
                                                                         title = ""
                                                                     }) => {
    // Estado para controlar la visualización según el tamaño
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [isVerySmallScreen, setIsVerySmallScreen] = useState(false);

    // Efecto para detectar el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 640);
            setIsVerySmallScreen(window.innerWidth < 480);
        };

        // Llamada inicial
        handleResize();

        // Establecer el listener
        window.addEventListener('resize', handleResize);

        // Limpiar el listener cuando el componente se desmonte
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Datos de ejemplo trimestrales si no se proporcionan
    const defaultData = [
        // Primer trimestre (Q1)
        { x: 12, y: 25, z: 100, trimestre: 'Q1', categoria: 'A' },
        { x: 18, y: 30, z: 80, trimestre: 'Q1', categoria: 'A' },
        { x: 24, y: 40, z: 120, trimestre: 'Q1', categoria: 'A' },
        { x: 10, y: 20, z: 90, trimestre: 'Q1', categoria: 'B' },
        { x: 15, y: 15, z: 70, trimestre: 'Q1', categoria: 'B' },
        { x: 20, y: 25, z: 110, trimestre: 'Q1', categoria: 'B' },

        // Segundo trimestre (Q2)
        { x: 14, y: 28, z: 110, trimestre: 'Q2', categoria: 'A' },
        { x: 22, y: 35, z: 95, trimestre: 'Q2', categoria: 'A' },
        { x: 28, y: 45, z: 130, trimestre: 'Q2', categoria: 'A' },
        { x: 12, y: 22, z: 95, trimestre: 'Q2', categoria: 'B' },
        { x: 18, y: 18, z: 80, trimestre: 'Q2', categoria: 'B' },
        { x: 24, y: 28, z: 115, trimestre: 'Q2', categoria: 'B' },

        // Tercer trimestre (Q3)
        { x: 16, y: 32, z: 120, trimestre: 'Q3', categoria: 'A' },
        { x: 26, y: 40, z: 105, trimestre: 'Q3', categoria: 'A' },
        { x: 32, y: 50, z: 140, trimestre: 'Q3', categoria: 'A' },
        { x: 14, y: 24, z: 100, trimestre: 'Q3', categoria: 'B' },
        { x: 20, y: 22, z: 90, trimestre: 'Q3', categoria: 'B' },
        { x: 28, y: 32, z: 120, trimestre: 'Q3', categoria: 'B' },

        // Cuarto trimestre (Q4)
        { x: 18, y: 36, z: 130, trimestre: 'Q4', categoria: 'A' },
        { x: 30, y: 45, z: 110, trimestre: 'Q4', categoria: 'A' },
        { x: 36, y: 55, z: 150, trimestre: 'Q4', categoria: 'A' },
        { x: 16, y: 26, z: 105, trimestre: 'Q4', categoria: 'B' },
        { x: 22, y: 24, z: 95, trimestre: 'Q4', categoria: 'B' },
        { x: 32, y: 36, z: 125, trimestre: 'Q4', categoria: 'B' },
    ];

    const chartData = data || defaultData;

    // Separar datos por categoría
    const categoryA = chartData.filter(item => item.categoria === 'A');
    const categoryB = chartData.filter(item => item.categoria === 'B');

    // Función para calcular la línea de tendencia usando regresión lineal
    const calculateTrendLine = (data: any[]) => {
        const n = data.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;

        data.forEach(item => {
            sumX += item.x;
            sumY += item.y;
            sumXY += item.x * item.y;
            sumXX += item.x * item.x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // Calcular puntos para la línea de tendencia
        const minX = Math.min(...data.map(item => item.x));
        const maxX = Math.max(...data.map(item => item.x));

        return [
            { x: minX, y: minX * slope + intercept },
            { x: maxX, y: maxX * slope + intercept }
        ];
    };

    // Calcular líneas de tendencia
    const trendLineA = useMemo(() => calculateTrendLine(categoryA), [categoryA]);
    const trendLineB = useMemo(() => calculateTrendLine(categoryB), [categoryB]);

    // Colores para las categorías
    const colorA = '#3b82f6'; // Azul
    const colorB = '#ef4444'; // Rojo

    // Estadísticas de correlación
    const calculateCorrelation = (data: any[]) => {
        const n = data.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumXX = 0;
        let sumYY = 0;

        data.forEach(item => {
            sumX += item.x;
            sumY += item.y;
            sumXY += item.x * item.y;
            sumXX += item.x * item.x;
            sumYY += item.y * item.y;
        });

        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

        return numerator / denominator;
    };

    const correlationA = calculateCorrelation(categoryA).toFixed(2);
    const correlationB = calculateCorrelation(categoryB).toFixed(2);

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div style={{ flex: 1, minHeight: isVerySmallScreen ? '180px' : '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        margin={{
                            top: isVerySmallScreen ? 10 : 20,
                            right: isVerySmallScreen ? 15 : 30,
                            left: isVerySmallScreen ? 10 : 20,
                            bottom: isVerySmallScreen ? 5 : 10,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="X"
                            tick={{ fontSize: isVerySmallScreen ? 8 : 10 }}
                            label={!isVerySmallScreen ? {
                                value: 'Variable X',
                                position: 'insideBottomRight',
                                offset: -5,
                                fontSize: 10
                            } : undefined}
                            tickCount={isVerySmallScreen ? 4 : undefined}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Y"
                            tick={{ fontSize: isVerySmallScreen ? 8 : 10 }}
                            label={!isVerySmallScreen ? {
                                value: 'Variable Y',
                                angle: -90,
                                position: 'insideLeft',
                                style: { textAnchor: 'middle' },
                                fontSize: 10
                            } : undefined}
                            tickCount={isVerySmallScreen ? 4 : undefined}
                        />
                        <ZAxis
                            type="number"
                            dataKey="z"
                            range={isVerySmallScreen ? [20, 100] : [40, 160]}
                            name="Z"
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: isVerySmallScreen ? '10px' : '12px',
                            }}
                            formatter={(value, name, props) => {
                                if (name === 'Z') return [`${value}`, 'Tamaño (Z)'];
                                return [`${value}`, name];
                            }}
                            itemSorter={(item) => {
                                // Ordenar para que X, Y, Z se muestren en ese orden
                                const order = { X: 0, Y: 1, Z: 2 };
                                return order[item.name as keyof typeof order] || 3;
                            }}
                            cursor={{ strokeDasharray: '3 3' }}
                            labelFormatter={(label) => {
                                // Mostrar el trimestre
                                const item = chartData.find(d => d.x === label);
                                return item ? `Trimestre: ${item.trimestre}` : label;
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                fontSize: isVerySmallScreen ? '10px' : '12px',
                                marginTop: isVerySmallScreen ? '2px' : '5px'
                            }}
                            iconSize={isVerySmallScreen ? 8 : 10}
                        />

                        {/* Puntos de dispersión */}
                        <Scatter
                            name="Categoría A"
                            data={categoryA}
                            fill={colorA}
                            line={{ stroke: 'rgba(0,0,0,0)' }} // Transparente
                        />
                        <Scatter
                            name="Categoría B"
                            data={categoryB}
                            fill={colorB}
                            line={{ stroke: 'rgba(0,0,0,0)' }} // Transparente
                        />

                        {/* Líneas de tendencia - solo en pantallas medianas o grandes */}
                        {!isVerySmallScreen && (
                            <>
                                <Line
                                    dataKey="y"
                                    data={trendLineA}
                                    stroke={colorA}
                                    dot={false}
                                    activeDot={false}
                                    strokeWidth={isSmallScreen ? 1.5 : 2}
                                    strokeDasharray="5 5"
                                    name="Tendencia A"
                                    isAnimationActive={false}
                                />
                                <Line
                                    dataKey="y"
                                    data={trendLineB}
                                    stroke={colorB}
                                    dot={false}
                                    activeDot={false}
                                    strokeWidth={isSmallScreen ? 1.5 : 2}
                                    strokeDasharray="5 5"
                                    name="Tendencia B"
                                    isAnimationActive={false}
                                />
                            </>
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>

            {/* Información de correlación - simplificada en pantallas pequeñas */}
            {isVerySmallScreen ? (
                <div style={{
                    marginTop: '4px',
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '10px',
                    gap: '10px'
                }}>
                    <span style={{ color: colorA }}>A: r={correlationA}</span>
                    <span style={{ color: colorB }}>B: r={correlationB}</span>
                </div>
            ) : (
                <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    justifyContent: 'space-around',
                    fontSize: isSmallScreen ? '10px' : '12px',
                    backgroundColor: '#f8fafc',
                    padding: isSmallScreen ? '4px' : '8px',
                    borderRadius: '4px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '2px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span style={{
                                width: isSmallScreen ? '8px' : '10px',
                                height: isSmallScreen ? '8px' : '10px',
                                backgroundColor: colorA,
                                borderRadius: '50%'
                            }}></span>
                            <span>Categoría A</span>
                        </div>
                        <span>Correlación: <strong>{correlationA}</strong></span>
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        margin: '2px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            <span style={{
                                width: isSmallScreen ? '8px' : '10px',
                                height: isSmallScreen ? '8px' : '10px',
                                backgroundColor: colorB,
                                borderRadius: '50%'
                            }}></span>
                            <span>Categoría B</span>
                        </div>
                        <span>Correlación: <strong>{correlationB}</strong></span>
                    </div>
                </div>
            )}

            {/* Nota explicativa - solo visible en pantallas normales */}
            {!isSmallScreen && (
                <div style={{
                    marginTop: '4px',
                    fontSize: '11px',
                    color: '#6b7280',
                    textAlign: 'center'
                }}>
                    El tamaño de los puntos (Z) representa la magnitud del valor asociado
                </div>
            )}
        </div>
    );
};

export default ScatterChartComponent;