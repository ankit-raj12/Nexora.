import { Connection } from "mongoose";

declare global {
  var mongo: {
    connection: Connection | null;
    pending: Promise<Connection> | null;
  };
}
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}

declare module "leaflet/dist/leaflet.css";

export {};
