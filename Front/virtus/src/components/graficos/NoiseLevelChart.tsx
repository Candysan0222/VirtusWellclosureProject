import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface NoiseLevelChartProps {
    data?: Array<any>;
    title?: string;
}

const NoiseLevelChart: React.FC<NoiseLevelChartProps> = ({
                                                             data,
                                                             title = "Nivel de Ruido (dB)"
                                                         }) => {
    // Datos simplificados (menos puntos para mejor visualización)
    const defaultData = [
        { hour: '00:00', value: 45 },
        { hour: '04:00', value: 38 },
        { hour: '08:00', value: 65 },
        { hour: '12:00', value: 75 },
        { hour: '16:00', value: 68 },
        { hour: '20:00', value: 68 },
    ];

    const chartData = data || defaultData;

    // Límites de referencia
    const moderateNoiseLevel = 65; // dB
    const highNoiseLevel = 75; // dB

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 9 }}
                        tickMargin={5}
                        padding={{ left: 5, right: 5 }}
                    />
                    <YAxis
                        domain={[30, 90]}
                        tick={{ fontSize: 9 }}
                        tickMargin={5}
                        width={25}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            fontSize: '10px',
                            padding: '5px'
                        }}
                        formatter={(value: number) => {
                            let label = value < moderateNoiseLevel ? 'Bajo' :
                                value < highNoiseLevel ? 'Moderado' : 'Alto';
                            return [`${value} dB (${label})`, 'Nivel'];
                        }}
                    />

                    {/* Líneas de referencia simplificadas */}
                    <ReferenceLine
                        y={moderateNoiseLevel}
                        stroke="#facc15"
                        strokeDasharray="3 3"
                        label={{
                            value: 'Mod.',
                            fill: '#facc15',
                            fontSize: 8,
                            position: 'insideTopRight'
                        }}
                    />
                    <ReferenceLine
                        y={highNoiseLevel}
                        stroke="#ef4444"
                        strokeDasharray="3 3"
                        label={{
                            value: 'Alto',
                            fill: '#ef4444',
                            fontSize: 8,
                            position: 'insideTopRight'
                        }}
                    />

                    <defs>
                        <linearGradient id="colorNoise" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                        </linearGradient>
                    </defs>

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorNoise)"
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default NoiseLevelChart;