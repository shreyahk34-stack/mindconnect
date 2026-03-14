import React, { useEffect, useState } from 'react';
import { getNearby, bookSession } from '../api';

function buildMapUrl(user, counselors) {
  if (!user) return null;
  const base = 'https://staticmap.openstreetmap.de/staticmap.php';
  const zoom = 14;
  const size = '640x400';
  const markers = [
    `${user.lat},${user.lng},lightblue1`,
    ...counselors.map((c) => `${c.lat},${c.lng},red-pushpin`),
  ].join('|');
  return `${base}?center=${user.lat},${user.lng}&zoom=${zoom}&size=${size}&markers=${encodeURIComponent(markers)}`;
}

export default function Counselors() {
  const [list, setList] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [manual, setManual] = useState({ lat: '', lng: '' });
  const [loading, setLoading] = useState(false);

  const loadNearby = async (lat, lng) => {
    setLoading(true);
    try {
      const l = await getNearby(lat, lng);
      setList(l);
    } catch (e) {
      console.error('Failed to load counselors', e);
      setGeoError('Unable to load nearby counselors right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser.');
      loadNearby();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLoc({ lat, lng });
        loadNearby(lat, lng);
      },
      async (err) => {
        setGeoError('Unable to get location. You can enter coordinates manually below.');
        loadNearby();
      },
      { timeout: 10000 }
    );
  }, []);

  const submitManualCoords = () => {
    const lat = parseFloat(manual.lat);
    const lng = parseFloat(manual.lng);
    if (!lat || !lng) {
      setGeoError('Please enter valid latitude and longitude values.');
      return;
    }
    setUserLoc({ lat, lng });
    setGeoError(null);
    loadNearby(lat, lng);
  };

  const book = async (id) => {
    const dt = new Date();
    dt.setDate(dt.getDate() + 1);
    const r = await bookSession(id, dt.toISOString());
    alert('Booked: ' + JSON.stringify(r));
  };

  const mapUrl = buildMapUrl(userLoc, list);

  return (
    <div style={{ padding: 20 }}>
      <h2>Nearby Counselors</h2>

      {geoError && (
        <div style={{ marginBottom: 12, color: 'darkred' }}>{geoError}</div>
      )}

      <div style={{ marginBottom: 20 }}>
        <strong>Map</strong>
        {mapUrl ? (
          <a
            href={`https://www.openstreetmap.org/?mlat=${userLoc?.lat}&mlon=${userLoc?.lng}#map=14/${userLoc?.lat}/${userLoc?.lng}`}
            target="_blank"
            rel="noreferrer"
            style={{ display: 'block', marginTop: 8 }}
          >
            <img
              src={mapUrl}
              alt="Map of nearby counselors"
              style={{ width: '100%', maxWidth: 700, border: '1px solid #ccc' }}
            />
          </a>
        ) : (
          <div style={{ marginTop: 8 }}>Move the map by allowing location or entering coordinates.</div>
        )}
      </div>

      <div style={{ marginBottom: 20 }}>
        <strong>Enter your coordinates manually</strong>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <input
            placeholder="Latitude"
            value={manual.lat}
            onChange={(e) => setManual((m) => ({ ...m, lat: e.target.value }))}
            style={{ padding: 8, flex: '1 1 150px' }}
          />
          <input
            placeholder="Longitude"
            value={manual.lng}
            onChange={(e) => setManual((m) => ({ ...m, lng: e.target.value }))}
            style={{ padding: 8, flex: '1 1 150px' }}
          />
          <button onClick={submitManualCoords} style={{ padding: '8px 12px' }}>
            Load Nearby
          </button>
        </div>
        <div style={{ marginTop: 8, fontSize: '0.9rem', color: '#555' }}>
          You can find your coordinates using Google Maps or any mapping tool.
        </div>
      </div>

      {loading ? (
        <div>Loading counselors…</div>
      ) : (
        <ul>
          {list.map((c) => (
            <li key={c.id} style={{ marginBottom: 14 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#444' }}>
                {c.dept} — {c.distance_km} km away
              </div>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => book(c.id)} style={{ padding: '6px 10px' }}>
                  Book Next Day
                </button>
                <a
                  href={`https://www.openstreetmap.org/directions?from=${userLoc?.lat},${userLoc?.lng}&to=${c.lat},${c.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ marginLeft: 10, color: '#2a6ebd' }}
                >
                  Get directions
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
