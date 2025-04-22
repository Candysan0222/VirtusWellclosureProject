import React from 'react';
import AirQualityChart from '../graficos/AirQualityChart';
import NoiseLevelChart from '../graficos/NoiseLevelChart';
import HeatmapChart from '../graficos/HeatmapChart';
import RadarChartComponent from '../graficos/RadarChart';
import RealTimeLineChart from '../graficos/RealTimeLineChart';
import StackedBarChart from '../graficos/StackedBarChart';
import ScatterChartComponent from '../graficos/ScatterChart';
import ComparativeBarChart from '../graficos/ComparativeBarChart';
// Asegúrate de importar tu archivo CSS donde hayas colocado los estilos
import './PaginaPrincipal.css';

interface ChartCardProps {
    title?: string;
    headerTitle?: string;
    children: React.ReactNode;
    verticalText?: string;
    secondaryTitle?: string;
    height?: string;
    width?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
                                                 title,
                                                 headerTitle,
                                                 children,
                                                 verticalText,
                                                 secondaryTitle,
                                                 height = '100%',
                                                 width = '100%'
                                             }) => {
    return (
        <div className="chart-card" style={{ height, width }}>
            {headerTitle && <h2 className="header-title">{headerTitle}</h2>}

            {title && <h3 className="chart-title">{title}</h3>}

            {verticalText && (
                <div className="vertical-text">
                    {verticalText}
                </div>
            )}

            <div className="chart-content" style={{ paddingLeft: verticalText ? '35px' : '0' }}>
                {children}
            </div>

            {secondaryTitle && (
                <div className="secondary-title">
                    {secondaryTitle}
                </div>
            )}
        </div>
    );
};

const PaginaPrincipal: React.FC = () => {
    const columnHeight = '940px';

    return (
        <div className="pagina-principal">
            {/* Fila superior */}
            <div className="fila-superior">
                <ChartCard
                    title="Calidad del aire"
                    verticalText="Preparación del pozo">
                    <AirQualityChart />
                </ChartCard>
                <ChartCard
                    title="Nivel de ruido"
                    verticalText="Preparación del pozo">
                    <NoiseLevelChart />
                </ChartCard>
            </div>

            {/* Fila inferior */}
            <div className="fila-inferior">
                {/* Columna 1 */}
                <div className="columna" style={{ height: columnHeight, width: '32%' }}>
                    <ChartCard
                        title="Contaminación de suelos"
                        verticalText="suspensión del pozo"
                        secondaryTitle="Calidad agua subterránea"
                    >
                        <HeatmapChart />
                    </ChartCard>
                    <ChartCard
                        title="Contaminación de suelos (Extra)"
                        verticalText="suspensión del pozo"
                        secondaryTitle="Real-Time"
                    >
                        <RealTimeLineChart />
                    </ChartCard>
                </div>

                {/* Columna 2 */}
                <div className="columna" style={{ height: columnHeight, width: '32%' }}>
                    <ChartCard
                        title="Emisión de gases"
                        verticalText="Abandono del pozo"
                        secondaryTitle="Impacto en biodiversidad"
                    >
                        <RadarChartComponent />
                    </ChartCard>
                    <ChartCard
                        title="Emisión acumulada"
                        verticalText="Abandono del pozo"
                        secondaryTitle="Emisiones por zona"
                    >
                        <StackedBarChart />
                    </ChartCard>
                </div>

                {/* Columna 3 */}
                <div className="columna" style={{ height: columnHeight, width: '32%' }}>
                    <ChartCard
                        title="Estabilidad estructural"
                        verticalText="Post-Abandono"
                        secondaryTitle="Contaminación residual"
                    >
                        <ComparativeBarChart />
                    </ChartCard>
                    <ChartCard
                        title="Desviaciones estructurales"
                        verticalText="Post-Abandono"
                        secondaryTitle="Análisis de dispersión"
                    >
                        <ScatterChartComponent />
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};

export default PaginaPrincipal;