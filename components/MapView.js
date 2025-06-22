import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import locations from '../data/locations';

// Fix default marker icon issue in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MapView() {
  const handleMarkerClick = async (loc, e) => {
  const apiKey = "9e863906576f141f72ad05443f7be508";

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${loc.latitude}&lon=${loc.longitude}&units=metric&appid=${apiKey}`
    );

    if (!res.ok) {
      throw new Error(`Gagal fetch (${res.status})`);
    }

    const data = await res.json();
    console.log("Data Cuaca:", data);

    const weather = data.weather?.[0]?.main ?? 'N/A';
    const temp = data.main?.temp ?? 'N/A';
    const humidity = data.main?.humidity ?? 'N/A';

    const popup = e.target.getPopup();
    popup.setContent(`
      <div>
        <h2 style="font-size:14px;font-weight:bold;margin-bottom:4px;">${loc.name}</h2>
        <p>Status: <span style="color:${loc.status === 'active' ? 'green' : 'red'}">${loc.status}</span></p>
        <p>Cuaca: ${weather}</p>
        <p>Suhu: ${temp}°C</p>
        <p>Kelembaban: ${humidity}%</p>
      </div>
    `);
  } catch (error) {
    console.error('Gagal mengambil data cuaca:', error);
  }
};




  return (
    <div style={{ height: '80vh', width: '100%' }}>
      <MapContainer
        center={[-6.891, 107.610]}
        zoom={17}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {locations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.latitude, loc.longitude]}
            eventHandlers={{
              click: (e) => handleMarkerClick(loc, e),
            }}
          >
            <Popup>
              <div>Memuat data cuaca...</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
