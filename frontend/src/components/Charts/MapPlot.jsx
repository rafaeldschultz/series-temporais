import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const getProperty = (mapType, feature, year) => {
  if (year === 2021)    return feature[mapType]["2021"]
  if (year === 2022)    return feature[mapType]["2022"]
  if (year === 2023)    return feature[mapType]["2023"]
  if (year === 2024)    return feature[mapType]["2024"]

  return feature[mapType]["aggr"]
}


// Função para determinar a cor com base no valor
const getColor = (incidency, min, max) => {
  if (incidency === 0) {
    return '#BEBEBE'; // Cor cinza para valores zero (sem dados)
  }

  const ratio = (incidency - min +0.00001) / (max - min); // Calcula a proporção do valor dentro do intervalo

  if (ratio <= 0) {
    return '#BEBEBE';
  }
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

const ChoroplethMap = ({mapType, geojsonData, year, state }) => {
  const [mapKey, setMapKey] = useState(Date.now());
  
  useEffect(() => {
    setMapKey(Date.now()); // Força o re-render quando `geojsonData` ou `year` mudam
  }, [geojsonData, year, state]);

  const [minValue, setMinValue] = useState(null);
  const [maxValue, setMaxValue] = useState(null);
  // Calcular o valor mínimo e máximo de "aggr/pop" entre os estados
  useEffect(() => {
    if (geojsonData) {
      const values = geojsonData.features.map(
        // (feature) => console.log(getProperty(mapType, feature.properties, year))
        (feature) => getProperty(mapType, feature.properties, year)
      );
      const min = Math.min(...values);
      const max = Math.max(...values);

      setMinValue(min);
      setMaxValue(max);
    }
  }, [geojsonData, year, state]);

  if (!geojsonData) {
    return <div>Carregando dados do mapa...</div>;
  }

  // Atualize o estilo com a função `getProperty`
  const style = (feature) => {
    const incidency = getProperty(mapType, feature.properties, year); // Passa o ano corretamente
    return {
      fillColor: getColor(incidency, minValue, maxValue),
      weight: 0.4,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    };
  };

  return (
    <MapContainer
      key={mapKey}
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
        style={(feature) => style(feature)}
      />
    </MapContainer>
  );
};


export default ChoroplethMap;