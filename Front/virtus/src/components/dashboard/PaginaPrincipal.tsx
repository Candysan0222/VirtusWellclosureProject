import React from 'react';
import AirQualityChart from '../graficos/AirQualityChart';
import NoiseLevelChart from '../graficos/NoiseLevelChart';
import HeatmapChart from '../graficos/HeatmapChart';
import RadarChartComponent from '../graficos/RadarChart';
import RealTimeLineChart from '../graficos/RealTimeLineChart';
import StackedBarChart from '../graficos/StackedBarChart';
import ScatterChartComponent from '../graficos/ScatterChart';
import ComparativeBarChart from '../graficos/ComparativeBarChart';

// Componente para una tarjeta de gráfico
interface ChartCardProps {
    title?: string;
    children: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => {
    return (
        <div style={{
            flex: '1 1 calc(50% - 20px)',
            minWidth: '400px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            margin: '10px',
            padding: '15px',
            height: '400px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {title && <h3 style={{
                margin: '0 0 15px 0',
                fontSize: '18px',
                fontWeight: '500',
                color: '#374151',
                textAlign: 'center'
            }}>{title}</h3>}
            <div style={{ flex: 1 }}>
                {children}
            </div>
        </div>
    );
};

const PaginaPrincipal: React.FC = () => {
    return (
        <div style={{
            padding: '20px',
            backgroundColor: '#f9fafb',
            minHeight: '100vh'
        }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: '#111827',
                textAlign: 'center'
            }}>
                Dashboard de Monitoreo Ambiental
            </h1>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '10px'
            }}>
                {/* Primera fila: Calidad del Aire y Nivel de Ruido */}
                <ChartCard title="Calidad del Aire (PM10, PM2.5)">
                    <AirQualityChart />
                </ChartCard>

                <ChartCard title="Nivel de Ruido (dB)">
                    <NoiseLevelChart />
                </ChartCard>

                {/* Segunda fila: Mapa de calor y Gráfico radar */}
                <ChartCard title="Mapa de Calor Semanal">
                    <HeatmapChart />
                </ChartCard>

                <ChartCard title="Análisis Quincenal por Categoría">
                    <RadarChartComponent />
                </ChartCard>

                {/* Tercera fila: Gráfico en tiempo real y Barras apiladas */}
                <ChartCard title="Monitoreo en Tiempo Real">
                    <RealTimeLineChart />
                </ChartCard>

                <ChartCard title="Distribución Mensual por Categoría">
                    <StackedBarChart />
                </ChartCard>

                {/* Cuarta fila: Gráfico de dispersión y Barras comparativas */}
                <ChartCard title="Análisis de Correlación Trimestral">
                    <ScatterChartComponent />
                </ChartCard>

                <ChartCard title="Comparativa Semestral por Sector">
                    <ComparativeBarChart />
                </ChartCard>
            </div>
        </div>
    );
};

export default PaginaPrincipal;