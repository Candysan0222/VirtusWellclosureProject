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
                                                             title = "Calidad del Aire (Concentración de PM10, PM2.5)"
                                                         }) => {
    // Datos de ejemplo diarios si no se proporcionan
    const defaultData = [
        { hour: '00:00', pm10: 35, pm25: 20 },
        { hour: '02:00', pm10: 30, pm25: 18 },
        { hour: '04:00', pm10: 25, pm25: 15 },
        { hour: '06:00', pm10: 42, pm25: 22 },
        { hour: '08:00', pm10: 55, pm25: 28 },
        { hour: '10:00', pm10: 60, pm25: 32 },
        { hour: '12:00', pm10: 62, pm25: 35 },
        { hour: '14:00', pm10: 58, pm25: 30 },
        { hour: '16:00', pm10: 65, pm25: 38 },
        { hour: '18:00', pm10: 70, pm25: 42 },
        { hour: '20:00', pm10: 55, pm25: 30 },
        { hour: '22:00', pm10: 40, pm25: 24 },
    ];

    const chartData = data || defaultData;

    // Límites de referencia (basados en estándares OMS)
    const pm10Limit = 45; // μg/m³
    const pm25Limit = 25; // μg/m³

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div style={{ flex: 1, minHeight: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                fontSize: '12px',
                            }}
                            formatter={(value, name) => {
                                return [`${value} μg/m³`, name === 'pm10' ? 'PM10' : 'PM2.5'];
                            }}
                        />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />

                        {/* Líneas de referencia para límites */}
                        <ReferenceLine y={pm10Limit} stroke="#ff7300" strokeDasharray="3 3" label={{
                            value: 'Límite PM10',
                            fill: '#ff7300',
                            fontSize: 10,
                            position: 'insideTopRight'
                        }} />
                        <ReferenceLine y={pm25Limit} stroke="#82ca9d" strokeDasharray="3 3" label={{
                            value: 'Límite PM2.5',
                            fill: '#82ca9d',
                            fontSize: 10,
                            position: 'insideTopRight'
                        }} />

                        <Line
                            type="monotone"
                            dataKey="pm10"
                            stroke="#ff7300"
                            name="PM10"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 5 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="pm25"
                            stroke="#82ca9d"
                            name="PM2.5"
                            strokeWidth={2}
                            dot={{ r: 2 }}
                            activeDot={{ r: 5 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280', textAlign: 'center' }}>
                Concentración en μg/m³ a lo largo del día
            </div>
        </div>
    );
};

export default AirQualityChart;