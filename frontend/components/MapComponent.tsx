import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const MapComponent = () => {
  const defaultPosition = [52.2297, 21.0122]; // Domyślne współrzędne (Warszawa)

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <MapContainer center={defaultPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
        {/* TileLayer nie wymaga już bezpośrednio "attribution", ale wchodzi w skład samego kafelka */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Marker */}
        <Marker position={defaultPosition}>
          <Popup>Warszawa - przykładowa lokalizacja</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
