import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface StackedBarChartProps {
    data?: Array<any>;
    title?: string;
    showSummary?: boolean; // Nuevo prop para controlar la visualización del resumen
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
                                                             data,
                                                             title = "",
                                                             showSummary = false // Por defecto, no mostrar el resumen adicional
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

    // Datos de ejemplo mensuales si no se proporcionan
    const defaultData = [
        {
            month: 'Ene',
            categoria1: 120,
            categoria2: 85,
            categoria3: 45,
            categoria4: 30,
            total: 280,
        },
        {
            month: 'Feb',
            categoria1: 100,
            categoria2: 90,
            categoria3: 50,
            categoria4: 40,
            total: 280,
        },
        {
            month: 'Mar',
            categoria1: 110,
            categoria2: 95,
            categoria3: 60,
            categoria4: 35,
            total: 300,
        },
        {
            month: 'Abr',
            categoria1: 125,
            categoria2: 85,
            categoria3: 70,
            categoria4: 40,
            total: 320,
        },
        {
            month: 'May',
            categoria1: 135,
            categoria2: 90,
            categoria3: 65,
            categoria4: 45,
            total: 335,
        },
        {
            month: 'Jun',
            categoria1: 150,
            categoria2: 95,
            categoria3: 60,
            categoria4: 35,
            total: 340,
        },
        {
            month: 'Jul',
            categoria1: 160,
            categoria2: 100,
            categoria3: 55,
            categoria4: 30,
            total: 345,
        },
        {
            month: 'Ago',
            categoria1: 140,
            categoria2: 110,
            categoria3: 50,
            categoria4: 40,
            total: 340,
        },
        {
            month: 'Sep',
            categoria1: 130,
            categoria2: 105,
            categoria3: 60,
            categoria4: 45,
            total: 340,
        },
        {
            month: 'Oct',
            categoria1: 120,
            categoria2: 100,
            categoria3: 70,
            categoria4: 50,
            total: 340,
        },
        {
            month: 'Nov',
            categoria1: 110,
            categoria2: 95,
            categoria3: 75,
            categoria4: 55,
            total: 335,
        },
        {
            month: 'Dic',
            categoria1: 130,
            categoria2: 105,
            categoria3: 80,
            categoria4: 60,
            total: 375,
        },
    ];

    // Para pantallas muy pequeñas, reducir el número de meses mostrados
    const getDisplayData = () => {
        if (isVerySmallScreen) {
            // En pantallas muy pequeñas, mostrar solo meses trimestrales
            return (data || defaultData).filter((_, index) => index % 3 === 0);
        } else if (isSmallScreen) {
            // En pantallas pequeñas, mostrar meses bimestrales
            return (data || defaultData).filter((_, index) => index % 2 === 0);
        }
        return data || defaultData;
    };

    const chartData = getDisplayData();

    // Colores para las categorías
    const colors = {
        categoria1: '#3b82f6', // Azul
        categoria2: '#10b981', // Verde
        categoria3: '#f59e0b', // Ámbar
        categoria4: '#ef4444'  // Rojo
    };

    // Nombres legibles para las categorías
    const categoryNames = {
        categoria1: 'Categoría A',
        categoria2: 'Categoría B',
        categoria3: 'Categoría C',
        categoria4: 'Categoría D'
    };

    // Calcular totales para análisis
    const totals = {
        categoria1: chartData.reduce((sum, item) => sum + item.categoria1, 0),
        categoria2: chartData.reduce((sum, item) => sum + item.categoria2, 0),
        categoria3: chartData.reduce((sum, item) => sum + item.categoria3, 0),
        categoria4: chartData.reduce((sum, item) => sum + item.categoria4, 0),
    };

    // Calcular porcentajes
    const total = Object.values(totals).reduce((sum: any, value) => sum + value, 0);
    const percentages = {
        categoria1: ((totals.categoria1 / total) * 100).toFixed(1),
        categoria2: ((totals.categoria2 / total) * 100).toFixed(1),
        categoria3: ((totals.categoria3 / total) * 100).toFixed(1),
        categoria4: ((totals.categoria4 / total) * 100).toFixed(1),
    };

    // Decidir qué categorías mostrar en pantallas pequeñas
    const getVisibleCategories = () => {
        if (isVerySmallScreen) {
            // En pantallas muy pequeñas, mostrar solo 2 categorías
            return ['categoria1', 'categoria2'];
        } else if (isSmallScreen) {
            // En pantallas pequeñas, mostrar 3 categorías
            return ['categoria1', 'categoria2', 'categoria3'];
        }
        return ['categoria1', 'categoria2', 'categoria3', 'categoria4'];
    };

    const visibleCategories = getVisibleCategories();

    // Usaremos la leyenda original de Recharts, configurada adecuadamente
    const formatLegend = (value: string) => {
        const categoryKey = value as keyof typeof categoryNames;
        return `${categoryNames[categoryKey]} ${totals[categoryKey]} (${percentages[categoryKey]}%)`;
    };

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div style={{ flex: 1, minHeight: isVerySmallScreen ? '160px' : '200px', marginBottom: '20px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: isVerySmallScreen ? 10 : 20,
                            right: isVerySmallScreen ? 15 : 30,
                            left: isVerySmallScreen ? 10 : 20,
                            bottom: 5,
                        }}
                        barSize={isVerySmallScreen ? 15 : 20}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: isVerySmallScreen ? 8 : 10 }}
                            axisLine={{ stroke: '#cbd5e1' }}
                            height={isVerySmallScreen ? 20 : 30}
                        />
                        <YAxis
                            tick={{ fontSize: isVerySmallScreen ? 8 : 10 }}
                            axisLine={{ stroke: '#cbd5e1' }}
                            width={isVerySmallScreen ? 25 : 35}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: isVerySmallScreen ? '10px' : '12px',
                            }}
                            formatter={(value, name) => {
                                const category = name as keyof typeof categoryNames;
                                return [`${value}`, categoryNames[category]];
                            }}
                            itemSorter={(item) => {
                                // Ordenar para que la leyenda muestre en el mismo orden que las barras apiladas
                                const categories = ['categoria4', 'categoria3', 'categoria2', 'categoria1'];
                                return categories.indexOf(item.dataKey as string);
                            }}
                            label
                        />
                        <Legend
                            formatter={formatLegend}
                            verticalAlign="bottom"
                            wrapperStyle={{
                                fontSize: isVerySmallScreen ? '10px' : '12px',
                                paddingTop: '5px',
                                paddingBottom: '5px'
                            }}
                            iconSize={isVerySmallScreen ? 10 : 14}
                            layout="vertical"
                            align="center"
                        />

                        {/* Barras apiladas en orden inverso para mantener consistencia visual */}
                        {visibleCategories.includes('categoria1') && (
                            <Bar
                                dataKey="categoria1"
                                stackId="a"
                                fill={colors.categoria1}
                                name="categoria1"
                            />
                        )}
                        {visibleCategories.includes('categoria2') && (
                            <Bar
                                dataKey="categoria2"
                                stackId="a"
                                fill={colors.categoria2}
                                name="categoria2"
                            />
                        )}
                        {visibleCategories.includes('categoria3') && (
                            <Bar
                                dataKey="categoria3"
                                stackId="a"
                                fill={colors.categoria3}
                                name="categoria3"
                            />
                        )}
                        {visibleCategories.includes('categoria4') && (
                            <Bar
                                dataKey="categoria4"
                                stackId="a"
                                fill={colors.categoria4}
                                name="categoria4"
                            />
                        )}
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Resumen de distribución - mostrar solo si showSummary es true */}
            {showSummary && (
                <div style={{
                    marginTop: isVerySmallScreen ? '5px' : '10px',
                    fontSize: isVerySmallScreen ? '10px' : '12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    gap: isVerySmallScreen ? '4px' : '8px',
                    padding: isVerySmallScreen ? '4px' : '8px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '4px'
                }}>
                    {Object.entries(categoryNames)
                        .filter(([key]) => visibleCategories.includes(key))
                        .map(([key, name], index) => {
                            const categoryKey = key as keyof typeof totals;
                            return (
                                <div key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px'
                                    }}>
                                        <span style={{
                                            width: isVerySmallScreen ? '8px' : '12px',
                                            height: isVerySmallScreen ? '8px' : '12px',
                                            backgroundColor: colors[categoryKey],
                                            display: 'inline-block',
                                            borderRadius: '2px'
                                        }}></span>
                                        <span style={{ fontWeight: 'bold' }}>{name}</span>
                                    </div>
                                    <span>
                                        {totals[categoryKey]} ({percentages[categoryKey]}%)
                                    </span>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default StackedBarChart;