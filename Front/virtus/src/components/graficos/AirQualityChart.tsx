import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

interface AirQualityChartProps {
    data?: Array<any>;
    title?: string;
}

const AirQualityChart: React.FC<AirQualityChartProps> = ({
                                                             data,
                                                             title = "Calidad del Aire (PM10, PM2.5)"
                                                         }) => {
    // Datos de ejemplo diarios si no se proporcionan
    const defaultData = [
        { hour: '00:00', pm10: 35, pm25: 20 },
        { hour: '04:00', pm10: 25, pm25: 15 },
        { hour: '08:00', pm10: 55, pm25: 28 },
        { hour: '12:00', pm10: 62, pm25: 35 },
        { hour: '16:00', pm10: 65, pm25: 38 },
        { hour: '20:00', pm10: 55, pm25: 30 },
    ];

    const chartData = data || defaultData;

    // Límites de referencia (basados en estándares OMS)
    const pm10Limit = 45; // μg/m³
    const pm25Limit = 25; // μg/m³

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
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
                        tick={{ fontSize: 10 }}
                        tickMargin={5}
                        padding={{ left: 5, right: 5 }}
                    />
                    <YAxis
                        tick={{ fontSize: 10 }}
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
                        formatter={(value, name) => {
                            return [`${value} μg/m³`, name === 'pm10' ? 'PM10' : 'PM2.5'];
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '10px' }}
                        height={15}
                    />

                    {/* Líneas de referencia con etiquetas más pequeñas */}
                    <ReferenceLine
                        y={pm10Limit}
                        stroke="#ff7300"
                        strokeDasharray="3 3"
                        label={{
                            value: 'Lím.PM10',
                            fill: '#ff7300',
                            fontSize: 8,
                            position: 'insideTopRight'
                        }}
                    />
                    <ReferenceLine
                        y={pm25Limit}
                        stroke="#82ca9d"
                        strokeDasharray="3 3"
                        label={{
                            value: 'Lím.PM2.5',
                            fill: '#82ca9d',
                            fontSize: 8,
                            position: 'insideTopRight'
                        }}
                    />

                    <Line
                        type="monotone"
                        dataKey="pm10"
                        stroke="#ff7300"
                        name="PM10"
                        strokeWidth={1.5}
                        dot={{ r: 1.5 }}
                        activeDot={{ r: 4 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="pm25"
                        stroke="#82ca9d"
                        name="PM2.5"
                        strokeWidth={1.5}
                        dot={{ r: 1.5 }}
                        activeDot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default AirQualityChart;