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
    // Datos de ejemplo diarios si no se proporcionan
    const defaultData = [
        { hour: '00:00', value: 45 },
        { hour: '02:00', value: 40 },
        { hour: '04:00', value: 38 },
        { hour: '06:00', value: 52 },
        { hour: '08:00', value: 65 },
        { hour: '10:00', value: 72 },
        { hour: '12:00', value: 75 },
        { hour: '14:00', value: 70 },
        { hour: '16:00', value: 68 },
        { hour: '18:00', value: 74 },
        { hour: '20:00', value: 68 },
        { hour: '22:00', value: 58 },
    ];

    const chartData = data || defaultData;

    // Límites de referencia
    const moderateNoiseLevel = 65; // dB
    const highNoiseLevel = 75; // dB

    // Función para determinar el color según el nivel de ruido
    const getNoiseColor = (level: number) => {
        if (level < moderateNoiseLevel) return '#4ade80'; // Verde
        if (level < highNoiseLevel) return '#facc15'; // Amarillo
        return '#ef4444'; // Rojo
    };

    // Conteo de periodos en cada nivel de ruido
    const lowNoisePeriods = chartData.filter(d => d.value < moderateNoiseLevel).length;
    const moderateNoisePeriods = chartData.filter(d => d.value >= moderateNoiseLevel && d.value < highNoiseLevel).length;
    const highNoisePeriods = chartData.filter(d => d.value >= highNoiseLevel).length;

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div style={{ flex: 1, minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 30,
                            left: 10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                        <YAxis
                            domain={[30, 90]}
                            tick={{ fontSize: 10 }}
                            label={{
                                value: 'dB',
                                angle: -90,
                                position: 'insideLeft',
                                style: { fontSize: '10px' }
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '12px',
                            }}
                            formatter={(value: number) => {
                                let label = value < moderateNoiseLevel ? 'Bajo' :
                                    value < highNoiseLevel ? 'Moderado' : 'Alto';
                                return [`${value} dB (${label})`, 'Nivel de ruido'];
                            }}
                        />

                        {/* Líneas de referencia para niveles de ruido */}
                        <ReferenceLine
                            y={moderateNoiseLevel}
                            stroke="#facc15"
                            strokeDasharray="3 3"
                            label={{
                                value: 'Moderado',
                                fill: '#facc15',
                                fontSize: 10,
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
                                fontSize: 10,
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
                            isAnimationActive={true}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div style={{
                marginTop: '8px',
                display: 'flex',
                justifyContent: 'space-around',
                fontSize: '12px'
            }}>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: '#4ade80',
              marginRight: '4px',
              borderRadius: '2px'
          }}></span>
          Bajo: {lowNoisePeriods} periodos
        </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: '#facc15',
              marginRight: '4px',
              borderRadius: '2px'
          }}></span>
          Moderado: {moderateNoisePeriods} periodos
        </span>
                <span style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{
              display: 'inline-block',
              width: '12px',
              height: '12px',
              backgroundColor: '#ef4444',
              marginRight: '4px',
              borderRadius: '2px'
          }}></span>
          Alto: {highNoisePeriods} periodos
        </span>
            </div>
        </div>
    );
};

export default NoiseLevelChart;