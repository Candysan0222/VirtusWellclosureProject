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
    ReferenceLine,
    LabelList
} from 'recharts';

interface ComparativeBarChartProps {
    data?: Array<any>;
    title?: string;
}

const ComparativeBarChart: React.FC<ComparativeBarChartProps> = ({
                                                                     data,
                                                                     title = "Gráfico de barras comparativas (datos semestrales)"
                                                                 }) => {
    // Datos de ejemplo semestrales si no se proporcionan
    const defaultData = [
        {
            name: 'Sector A',
            primerSemestre: 4000,
            segundoSemestre: 4600,
            crecimiento: 15
        },
        {
            name: 'Sector B',
            primerSemestre: 3000,
            segundoSemestre: 2400,
            crecimiento: -20
        },
        {
            name: 'Sector C',
            primerSemestre: 2000,
            segundoSemestre: 2800,
            crecimiento: 40
        },
        {
            name: 'Sector D',
            primerSemestre: 2780,
            segundoSemestre: 3300,
            crecimiento: 18.7
        },
        {
            name: 'Sector E',
            primerSemestre: 1890,
            segundoSemestre: 1650,
            crecimiento: -12.7
        },
        {
            name: 'Sector F',
            primerSemestre: 2390,
            segundoSemestre: 3100,
            crecimiento: 29.7
        },
        {
            name: 'Sector G',
            primerSemestre: 3490,
            segundoSemestre: 3200,
            crecimiento: -8.3
        },
    ];

    const chartData = data || defaultData;

    // Ordenar datos por crecimiento para destacar sectores con mayor y menor rendimiento
    const sortedData = [...chartData].sort((a, b) => b.crecimiento - a.crecimiento);
    const topPerformer = sortedData[0];
    const worstPerformer = sortedData[sortedData.length - 1];

    // Calcular totales para análisis
    const totalPrimerSemestre = chartData.reduce((sum, item) => sum + item.primerSemestre, 0);
    const totalSegundoSemestre = chartData.reduce((sum, item) => sum + item.segundoSemestre, 0);
    const crecimientoPromedio = chartData.reduce((sum, item) => sum + item.crecimiento, 0) / chartData.length;
    const crecimientoTotal = ((totalSegundoSemestre - totalPrimerSemestre) / totalPrimerSemestre) * 100;

    // Colores para las barras
    const primerSemestreColor = '#3b82f6'; // Azul
    const segundoSemestreColor = '#f97316'; // Naranja

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>

            {/* Indicadores de resumen */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                marginBottom: '10px',
                padding: '8px',
                backgroundColor: '#f8fafc',
                borderRadius: '4px',
                fontSize: '12px'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: 'bold', color: '#6b7280' }}>Crecimiento Total</span>
                    <span style={{
                        fontWeight: 'bold',
                        color: crecimientoTotal >= 0 ? '#10b981' : '#ef4444',
                        fontSize: '14px'
                    }}>
            {crecimientoTotal.toFixed(1)}%
          </span>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: 'bold', color: '#6b7280' }}>Mayor Crecimiento</span>
                    <span style={{
                        fontWeight: 'bold',
                        color: '#10b981',
                        fontSize: '14px'
                    }}>
            {topPerformer.name}: +{topPerformer.crecimiento}%
          </span>
                </div>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}>
                    <span style={{ fontWeight: 'bold', color: '#6b7280' }}>Menor Crecimiento</span>
                    <span style={{
                        fontWeight: 'bold',
                        color: '#ef4444',
                        fontSize: '14px'
                    }}>
            {worstPerformer.name}: {worstPerformer.crecimiento}%
          </span>
                </div>
            </div>

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
                            dataKey="name"
                            tick={{ fontSize: 10 }}
                            interval={0}
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
                                if (name === 'primerSemestre') return [`${value}`, 'Primer Semestre'];
                                if (name === 'segundoSemestre') return [`${value}`, 'Segundo Semestre'];
                                return [`${value}`, name];
                            }}
                            labelFormatter={(label) => `Sector: ${label}`}
                        />
                        <Legend
                            wrapperStyle={{ fontSize: '12px' }}
                            payload={[
                                { value: 'Primer Semestre', type: 'rect', color: primerSemestreColor },
                                { value: 'Segundo Semestre', type: 'rect', color: segundoSemestreColor }
                            ]}
                        />

                        {/* Línea de referencia para el valor cero */}
                        <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

                        {/* Barras para el primer semestre */}
                        <Bar
                            dataKey="primerSemestre"
                            name="primerSemestre"
                            fill={primerSemestreColor}
                            radius={[3, 3, 0, 0]}
                        />

                        {/* Barras para el segundo semestre */}
                        <Bar
                            dataKey="segundoSemestre"
                            name="segundoSemestre"
                            fill={segundoSemestreColor}
                            radius={[3, 3, 0, 0]}
                        >
                            <LabelList
                                dataKey="crecimiento"
                                position="top"
                                content={({ x, y, width, height, value, index }) => {
                                    const item = chartData[index];
                                    const growth = item?.crecimiento || 0;
                                    const color = growth >= 0 ? '#10b981' : '#ef4444';
                                    const sign = growth >= 0 ? '+' : '';

                                    return (
                                        <text
                                            x={Number(x) + Number(width) / 2}
                                            y={Number(y) - 10}
                                            textAnchor="middle"
                                            fontSize="10"
                                            fontWeight="bold"
                                            fill={color}
                                        >
                                            {sign}{growth}%
                                        </text>
                                    );
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div style={{
                marginTop: '8px',
                fontSize: '11px',
                color: '#6b7280',
                textAlign: 'center'
            }}>
                Comparativa semestral por sector con porcentajes de crecimiento
            </div>
        </div>
    );
};

export default ComparativeBarChart;