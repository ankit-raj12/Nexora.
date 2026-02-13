import { MapContainer, Marker, TileLayer, Popup, Polyline, useMap } from "react-leaflet";
import { LocationType } from "./DeliveryBoyHome";
import L, { LatLngExpression } from "leaflet";
import { useEffect } from "react";

interface PropsInterface {
  deliveryBoyLocation: LocationType;
  userLocation: LocationType;
}

const MapRecenter = ({ 
  userLocation, 
  deliveryBoyLocation 
}: { 
  userLocation: LocationType; 
  deliveryBoyLocation?: LocationType 
}) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (
      deliveryBoyLocation &&
      deliveryBoyLocation.latitude &&
      deliveryBoyLocation.longitude &&
      userLocation &&
      userLocation.latitude &&
      userLocation.longitude
    ) {
      try {
        const bounds = L.latLngBounds([
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]);
        requestAnimationFrame(() => {
            map.fitBounds(bounds, { padding: [50, 50] });
        });
      } catch (error) {
         console.warn("Map bounds error:", error);
      }
    } 
    else if (userLocation && userLocation.latitude && userLocation.longitude) {
       map.setView([userLocation.latitude, userLocation.longitude], 15);
    }
  }, [userLocation, deliveryBoyLocation, map]);

  return null;
};

export default function LiveMapTrack({
  deliveryBoyLocation,
  userLocation,
}: PropsInterface) {

  const UserIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/9384/9384815.png",
    iconSize: [45, 45],
  });

  const DeliveryBoyIcon = L.icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/128/13261/13261597.png",
    iconSize: [45, 45],
  });

  const center = [userLocation.latitude, userLocation.longitude];

  const lineLocation =
    userLocation && deliveryBoyLocation
      ? [
          [userLocation.latitude, userLocation.longitude],
          [deliveryBoyLocation.latitude, deliveryBoyLocation.longitude],
        ]
      : [];

  return (
    <MapContainer
      center={center as LatLngExpression}
      zoom={15}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
    >
      <MapRecenter userLocation={userLocation} deliveryBoyLocation={deliveryBoyLocation} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[userLocation.latitude, userLocation.longitude]}
        icon={UserIcon}
      >
        <Popup>Delivery Address</Popup>
      </Marker>
      {deliveryBoyLocation && (
        <Marker
          position={[
            deliveryBoyLocation.latitude,
            deliveryBoyLocation.longitude,
          ]}
          icon={DeliveryBoyIcon}
        >
          <Popup>Delivery boy location</Popup>
        </Marker>
      )}
      <Polyline positions={lineLocation as LatLngExpression[]} />
    </MapContainer>
  );
}
