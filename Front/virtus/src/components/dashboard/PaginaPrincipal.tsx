import React from 'react';
// ajusta la ruta si es diferente
import HeatmapChart from '../graficos/HeatmapChart';
import RadarChartComponent from '../graficos/RadarChart';
import EmissionsRadarChart from '../graficos/EmissionsRadarChart';
import WellRadarEmissionsChart from "../graficos/WellRadarEmissionsChart";
import ComparativeBarChart from '../graficos/ComparativeBarChart';
import Alerts from "../graficos/Alerts";
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
                                                 height = 'auto',
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
    return (
        <div className="pagina-principal">
            {/* Grid layout container */}
            <div className="dashboard-grid">
                {/* Primera columna - gráficos principales (izquierda) */}
                <div className="dashboard-column main-column">
                    <ChartCard title="Datos de Rendimiento">
                        <RadarChartComponent />
                    </ChartCard>

                    <ChartCard>
                        <EmissionsRadarChart />
                    </ChartCard>

                    <ChartCard>
                        <WellRadarEmissionsChart />
                    </ChartCard>
                </div>

                {/* Segunda columna - gráficos secundarios (derecha) */}
                <div className="dashboard-column side-column">
                    <ChartCard
                    >
                        <Alerts />
                    </ChartCard>
                </div>
            </div>
        </div>
    );
};

export default PaginaPrincipal;