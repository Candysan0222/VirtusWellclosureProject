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
                                                                     title = "Comparativa Semestral"
                                                                 }) => {
    // Datos de ejemplo simplificados
    const defaultData = [
        {
            name: 'A',
            primerSemestre: 4000,
            segundoSemestre: 4600,
            crecimiento: 15
        },
        {
            name: 'B',
            primerSemestre: 3000,
            segundoSemestre: 2400,
            crecimiento: -20
        },
        {
            name: 'C',
            primerSemestre: 2000,
            segundoSemestre: 2800,
            crecimiento: 40
        },
        {
            name: 'D',
            primerSemestre: 2780,
            segundoSemestre: 3300,
            crecimiento: 18.7
        },
    ];

    const chartData = data || defaultData;

    // Colores para las barras
    const primerSemestreColor = '#3b82f6'; // Azul
    const segundoSemestreColor = '#f97316'; // Naranja

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={chartData}
                    margin={{
                        top: 15,
                        right: 10,
                        left: 0,
                        bottom: 5,
                    }}
                    barGap={2}
                    barSize={15}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="name"
                        tick={{ fontSize: 9 }}
                        interval={0}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickMargin={5}
                    />
                    <YAxis
                        tick={{ fontSize: 9 }}
                        axisLine={{ stroke: '#cbd5e1' }}
                        tickMargin={5}
                        width={30}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '10px',
                            padding: '5px'
                        }}
                        formatter={(value, name) => {
                            if (name === 'primerSemestre') return [`${value}`, 'Primer Sem.'];
                            if (name === 'segundoSemestre') return [`${value}`, 'Segundo Sem.'];
                            return [`${value}`, name];
                        }}
                        labelFormatter={(label) => `Sector: ${label}`}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '9px' }}
                        height={15}
                        payload={[
                            { value: 'Primer Sem.', type: 'rect', color: primerSemestreColor },
                            { value: 'Segundo Sem.', type: 'rect', color: segundoSemestreColor }
                        ]}
                    />

                    {/* Línea de referencia para el valor cero */}
                    <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />

                    {/* Barras para el primer semestre */}
                    <Bar
                        dataKey="primerSemestre"
                        name="primerSemestre"
                        fill={primerSemestreColor}
                        radius={[2, 2, 0, 0]}
                    />

                    {/* Barras para el segundo semestre */}
                    <Bar
                        dataKey="segundoSemestre"
                        name="segundoSemestre"
                        fill={segundoSemestreColor}
                        radius={[2, 2, 0, 0]}
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
                                        y={Number(y) - 5}
                                        textAnchor="middle"
                                        fontSize="8"
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
    );
};

export default ComparativeBarChart;