"use client";
import { getSocket } from "@/lib/socket";
import { useEffect } from "react";

export default function GeoUpdater({ userId }: { userId: string }) {
  const socket = getSocket();
  useEffect(() => {
    if (!userId) return;
    if (!navigator.geolocation) return;
    socket.emit("identity", userId);
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        socket.emit("update-location", ({
          userId,
          latitude,
          longitude,
        }));
      },
      (error) => console.log("Getting geoLocation Error ",error),
      { enableHighAccuracy: true },
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [socket, userId]);
  return null;
}
