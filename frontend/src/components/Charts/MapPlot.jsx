import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';


// Função para determinar a cor com base no valor
const getColor = (occurrencies, value, min, max) => {
  if (occurrencies === 0) {
    return '#BEBEBE'; // Cor cinza para valores zero (sem dados)
  }

  const ratio = (value - min) / (max - min); // Calcula a proporção do valor dentro do intervalo

  if (ratio <= 0) return '#FFEDA0';
  if (ratio <= 0.1) return '#FED976';
  if (ratio <= 0.2) return '#FEB24C';
  if (ratio <= 0.3) return '#FD8D3C';
  if (ratio <= 0.4) return '#FC4E2A';
  if (ratio <= 0.5) return '#E31A1C';
  if (ratio <= 0.6) return '#E31A1C';
  if (ratio <= 0.7) return '#BD0026';
  if (ratio <= 0.8) return '#800026';
  return '#800026';
};


// Função de estilo para os dados do GeoJSON
const style = (ocurrencies, feature, min, max) => {
  return {
    fillColor: getColor(ocurrencies, feature, min, max), // Substitua "numero de ocorrencias" pela propriedade do seu GeoJSON
    weight: 0.4,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  };
};

const ChoroplethMap = ({ geojsonData, sx }) => {
  const [mapKey, setMapKey] = useState(Date.now()); // Forçar re-render com chave única
  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);

  // Calcular o valor mínimo e máximo de "numero de ocorrencias" entre os estados
  useEffect(() => {
    if (geojsonData) {
      const values = geojsonData.features.map(
        (feature) => feature.properties.aggr / feature.properties.pop
      );

      const min = Math.min(...values);
      const max = Math.max(...values);

      setMinValue(min);
      setMaxValue(max);
    }
  }, [geojsonData]);

  // Atualizar a chave para forçar re-render quando geojsonData mudar
  useEffect(() => {
    setMapKey(Date.now()); // Atualiza a chave para re-renderizar o mapa
  }, [geojsonData]);

  if (!geojsonData || minValue === null || maxValue === null) {
    return <div>Carregando dados do mapa...</div>;
  }

  return (
    <MapContainer
      key={mapKey} // Força o re-render com chave única
      center={[geojsonData.info.center_lat, geojsonData.info.center_lon]}
      zoom={geojsonData.info.zoom}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON
        data={geojsonData}
        style={(feature) => style(feature.properties.aggr, feature.properties.aggr / feature.properties.pop, minValue, maxValue)}
      />
    </MapContainer>
  );
};

export default ChoroplethMap;