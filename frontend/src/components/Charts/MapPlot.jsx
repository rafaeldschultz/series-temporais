import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import geojsonData from '../../assets/brasil.js';


// Function to determine the color based on a property value
const getColor = (value) => {

  return value > 1000
    ? '#800026'
    : value > 500
    ? '#BD0026'
    : value > 200
    ? '#E31A1C'
    : value > 100
    ? '#FC4E2A'
    : value > 50
    ? '#FD8D3C'
    : value > 20
    ? '#FEB24C'
    : value > 10
    ? '#FED976'
    : '#FFEDA0';
};

// Style function for GeoJSON layers
const style = (feature) => {
  return {
    fillColor: getColor(feature.properties["numero de ocorrencias"]), // Replace 'density' with your GeoJSON property
    weight: 0.4,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  };
};

const ChoroplethMap = () => {
  return (
    <MapContainer
      center={[-14.235, -51.9253]}
      zoom={4}
      style={{ height: '600px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON data={geojsonData} style={style} />
    </MapContainer>
  );
};

export default ChoroplethMap;
