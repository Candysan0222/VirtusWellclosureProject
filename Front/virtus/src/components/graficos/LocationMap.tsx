import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Location {
    id: number;
    name: string;
    lat: number;
    lng: number;
}

// Define the type for props
interface LocationMapProps {
    locations?: Location[];
    title?: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ locations = [], title = "Ubicaciones" }) => {
    const sampleLocations = locations.length ? locations : [
        { id: 1, name: 'Oficina Principal', lat: 40.416775, lng: -3.703790 },
        { id: 2, name: 'Almacén', lat: 40.453054, lng: -3.688344 },
        { id: 3, name: 'Tienda', lat: 40.420139, lng: -3.705471 }
    ];

    const defaultCenter: [number, number] = [sampleLocations[0].lat, sampleLocations[0].lng];
    const [center, setCenter] = useState<[number, number]>(defaultCenter);
    const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
    const defaultZoom = 13;

    useEffect(() => {
        if (sampleLocations.length > 0) {
            setCenter([sampleLocations[0].lat, sampleLocations[0].lng]);
        }
    }, [sampleLocations]);

    // Control de zoom y centro del mapa
    const ChangeMapCenter = () => {
        const map = useMap();
        map.setView(center, defaultZoom);
        return null;
    };

    // Función para centrar el mapa en una ubicación específica
    const handleLocationClick = (loc: Location) => {
        setCenter([loc.lat, loc.lng]);
        setSelectedLocation(loc.id);
    };

    // Define el icono fuera del rendering para evitar recreaciones
    const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet/dist/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-lg font-medium text-center mb-2">{title}</h3>
            <div style={{
                flex: 1,
                minHeight: '200px',
                backgroundColor: '#e2e8f0',
                borderRadius: '0.5rem',
                position: 'relative'
            }}>
                {/* Mapa con React Leaflet */}
                <MapContainer
                    style={{ height: '100%', width: '100%' }}
                    // @ts-ignore - ignore the TypeScript error about props
                    center={defaultCenter}
                    zoom={defaultZoom}
                >
                    {/* Establecer el centro y zoom */}
                    <ChangeMapCenter />

                    {/* TileLayer es el fondo del mapa */}
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Marcadores */}
                    {sampleLocations.map(loc => (
                        <Marker
                            key={loc.id}
                            position={[loc.lat, loc.lng] as [number, number]}
                            // @ts-ignore - ignore the TypeScript error about icon
                            icon={defaultIcon}
                        >
                            <Popup>{loc.name}</Popup>
                        </Marker>
                    ))}
                </MapContainer>

                {/* Información de ubicaciones encima del mapa */}
                <div style={{
                    position: 'absolute',
                    bottom: '0.5rem',
                    left: '0.5rem',
                    right: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.75)',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    fontSize: '0.75rem'
                }}>
                    {sampleLocations.map(loc => (
                        <div key={loc.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                            <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '9999px', backgroundColor: '#3B82F6', marginRight: '0.5rem' }}></span>
                            <span>{loc.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leyenda interactiva debajo del mapa */}
            <div className="mt-4 border rounded-lg p-3 bg-white">
                <h4 className="text-md font-medium mb-2">Puntos de interés</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {sampleLocations.map(loc => (
                        <button
                            key={loc.id}
                            onClick={() => handleLocationClick(loc)}
                            className={`p-2 text-left rounded hover:bg-gray-100 flex items-center ${selectedLocation === loc.id ? 'bg-blue-100 border border-blue-300' : ''}`}
                        >
                            <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mr-2">
                                <span className="text-blue-800 font-bold">{loc.id}</span>
                            </div>
                            <div>
                                <div className="font-medium">{loc.name}</div>
                                <div className="text-xs text-gray-500">Lat: {loc.lat.toFixed(4)}, Lng: {loc.lng.toFixed(4)}</div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LocationMap;