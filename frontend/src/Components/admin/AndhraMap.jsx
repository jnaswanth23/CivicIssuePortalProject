import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";

export default function AndhraMap({ issues }) {

  const center = [15.9129,79.7400];

  return (
    <MapContainer
      center={center}
      zoom={7}
      style={{height:"500px"}}
    >

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MarkerClusterGroup>

        {issues.map(issue => (

          <Marker
            key={issue.id}
            position={[issue.latitude,issue.longitude]}
          >

            <Popup>
              <b>{issue.title}</b>
              <br/>
              {issue.description}
              <br/>
              Status: {issue.status}
            </Popup>

          </Marker>

        ))}

      </MarkerClusterGroup>

    </MapContainer>
  );
}