import React from 'react';
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
}

const StackedBarChart: React.FC<StackedBarChartProps> = ({
                                                             data,
                                                             title = "Gráfico de barras apiladas (datos mensuales)"
                                                         }) => {
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

    const chartData = data || defaultData;

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

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div style={{ flex: 1, minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis
                            dataKey="month"
                            tick={{ fontSize: 10 }}
                            axisLine={{ stroke: '#cbd5e1' }}
                        />
                        <YAxis
                            tick={{ fontSize: 10 }}
                            axisLine={{ stroke: '#cbd5e1' }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '12px',
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
                            wrapperStyle={{ fontSize: '12px' }}
                            formatter={(value) => {
                                const category = value as keyof typeof categoryNames;
                                return categoryNames[category];
                            }}
                        />

                        {/* Barras apiladas en orden inverso para mantener consistencia visual */}
                        <Bar
                            dataKey="categoria1"
                            stackId="a"
                            fill={colors.categoria1}
                            name="categoria1"
                        />
                        <Bar
                            dataKey="categoria2"
                            stackId="a"
                            fill={colors.categoria2}
                            name="categoria2"
                        />
                        <Bar
                            dataKey="categoria3"
                            stackId="a"
                            fill={colors.categoria3}
                            name="categoria3"
                        />
                        <Bar
                            dataKey="categoria4"
                            stackId="a"
                            fill={colors.categoria4}
                            name="categoria4"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Resumen de distribución */}
            <div style={{
                marginTop: '10px',
                fontSize: '12px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
                gap: '8px',
                padding: '8px',
                backgroundColor: '#f8fafc',
                borderRadius: '4px'
            }}>
                {Object.entries(categoryNames).map(([key, name], index) => {
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
                    width: '12px',
                    height: '12px',
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
        </div>
    );
};

export default StackedBarChart;