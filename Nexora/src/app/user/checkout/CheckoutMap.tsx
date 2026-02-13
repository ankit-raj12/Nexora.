/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import L, { LatLngExpression } from "leaflet";
import { FC, useEffect, useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";

interface DraggableMarkerProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  onAddressFound: (data: any) => void;
}

const DraggableMarker: FC<DraggableMarkerProps> = ({
  position,
  setPosition,
  onAddressFound,
}) => {
  const map = useMap();

  const locationIcon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
        iconSize: [40, 40],
        iconAnchor: [20, 40],
      }),
    [],
  );

  useEffect(() => {
    if (position) {
      map.setView(position as LatLngExpression, 16, { animate: true });
    }
  }, [map, position]);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!position) return;
      try {
        const result = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${position[0]}&lon=${position[1]}&format=json`,
        ).then((res) => res.json());
        onAddressFound(result);
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };
    fetchAddress();
  }, [position, onAddressFound]);

  if (!position) return null;

  return (
    <Marker
      icon={locationIcon}
      position={position as LatLngExpression}
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        },
      }}
    />
  );
};

interface CheckoutMapProps {
  position: [number, number] | null;
  setPosition: (pos: [number, number]) => void;
  handleAddressFound: (data: any) => void;
}

const CheckoutMap: FC<CheckoutMapProps> = ({
  position,
  setPosition,
  handleAddressFound,
}) => {
  if (!position) return null;
  
  return (
    <MapContainer
      center={position as LatLngExpression}
      zoom={15}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <DraggableMarker
        position={position}
        setPosition={setPosition}
        onAddressFound={handleAddressFound}
      />
    </MapContainer>
  );
};

export default CheckoutMap;
