import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L, { LatLng, LatLngExpression } from "leaflet";
import { useEffect, useState } from "react";

/* ===== Fix marker icon ===== */
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

/* ===== Route cố định (GREEN) ===== */
const FIXED_ROUTE: LatLngExpression[] = [
  [10.294315, 106.419796],
  [10.294353, 106.419845],
  [10.294407, 106.419883],
  [10.29447, 106.419902],
  [10.294536, 106.419902],
  [10.294614, 106.419871],
  [10.294665, 106.419827],
  [10.2947, 106.419769],
  [10.294716, 106.419703],
  [10.294709, 106.419628],
  [10.294678, 106.41956],
  [10.294621, 106.419503],
  [10.294548, 106.419471],
  [10.294468, 106.419468],
  [10.29442, 106.419481],
  [10.294376, 106.419505],
  [10.294321, 106.419562],
  [10.29429, 106.419635],
  [10.294286, 106.419715],
  [10.294312, 106.419793],
  [10.294231, 106.420012],
  [10.294134, 106.420191],
  [10.293921, 106.420596],
  [10.2939, 106.420649],
  [10.293862, 106.420749],
  [10.293792, 106.420875],
  [10.293017, 106.422493],
  [10.292829, 106.422886],
  [10.292376, 106.423832],
  [10.291839, 106.424953],
  [10.29157, 106.425514],
  [10.291238, 106.426208],
  [10.290466, 106.427821],
  [10.289868, 106.429077],
  [10.289789, 106.429243],
  [10.289562, 106.429718],
  [10.289498, 106.429853],
  [10.289256, 106.430367],
  [10.288974, 106.430945],
  [10.288739, 106.431425],
  [10.291056, 106.432512],
  [10.291449, 106.432685],
  [10.292277, 106.433047],
  [10.292868, 106.433348],
  [10.293156, 106.433496],
  [10.293326, 106.433602],
  [10.293677, 106.43385],
  [10.293776, 106.433901],
  [10.294108, 106.433999],
  [10.294259, 106.434047],
  [10.294393, 106.434084],
  [10.295731, 106.434575],
  [10.295493, 106.435107],
  [10.295449, 106.435308],
  [10.295464, 106.435529],
  [10.295542, 106.436078],
  [10.295597, 106.436455],
  [10.295622, 106.436747],
  [10.29562, 106.437026],
  [10.295589, 106.437241],
  [10.295453, 106.437609],
];

/* ===== Locate current position ===== */
function LocateMe({
  onFound,
}: {
  onFound: (latlng: LatLng) => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.locate({
      setView: true,
      enableHighAccuracy: true,
      maxZoom: 16,
    });

    map.on("locationfound", (e) => onFound(e.latlng));

    // map.on("locationerror", () =>
    //   alert("Không lấy được vị trí hiện tại")
    // );
  }, [map, onFound]);

  return null;
}

/* ===== MAIN ===== */
export default function MapRoute() {
  const [myPos, setMyPos] = useState<LatLng | null>(null);
  const [toEndRoute, setToEndRoute] = useState<
    LatLngExpression[]
  >([]);

  const endPoint = FIXED_ROUTE.at(-1)! as [number, number];

  /* ===== Route từ vị trí hiện tại → cuối route ===== */
  useEffect(() => {
    if (!myPos) return;

    fetch(
      `https://router.project-osrm.org/route/v1/driving/` +
        `${myPos.lng},${myPos.lat};${endPoint[1]},${endPoint[0]}` +
        `?overview=full&geometries=geojson`
    )
      .then((res) => res.json())
      .then((data) => {
        const coords: LatLngExpression[] =
          data.routes[0].geometry.coordinates.map(
            ([lng, lat]: [number, number]) => [lat, lng]
          );

        console.log("Route to fixed end:", data.routes[0]);
        setToEndRoute(coords);
      });
  }, [myPos]);

  return (
    <MapContainer
      center={FIXED_ROUTE[0]}
      zoom={15}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      {/* Lấy vị trí hiện tại */}
      <LocateMe onFound={setMyPos} />

      {/* Route cố định – GREEN */}
      <Polyline
        positions={FIXED_ROUTE}
        pathOptions={{
          color: "#2ECC71",
          weight: 7,
        }}
      />

      {/* Route từ current → end – BLUE */}
      {toEndRoute.length > 0 && (
        <Polyline
          positions={toEndRoute}
          pathOptions={{
            color: "#007AFF",
            weight: 7,
          }}
        />
      )}

      {/* Marker */}
      {myPos && (
        <Marker position={myPos}>
          <Popup>📍 Vị trí hiện tại</Popup>
        </Marker>
      )}

      <Marker position={endPoint}>
        <Popup>🎯 Điểm cuối</Popup>
      </Marker>
    </MapContainer>
  );
}

const fixedGreenRoute: LatLngExpression[] = [
  [10.294315, 106.419796],
  [10.294353, 106.419845],
  [10.294407, 106.419883],
  [10.29447, 106.419902],
  [10.294536, 106.419902],
  [10.294614, 106.419871],
  [10.294665, 106.419827],
  [10.2947, 106.419769],
  [10.294716, 106.419703],
  [10.294709, 106.419628],
  [10.294678, 106.41956],
  [10.294621, 106.419503],
  [10.294548, 106.419471],
  [10.294468, 106.419468],
  [10.29442, 106.419481],
  [10.294376, 106.419505],
  [10.294321, 106.419562],
  [10.29429, 106.419635],
  [10.294286, 106.419715],
  [10.294312, 106.419793],
  [10.294231, 106.420012],
  [10.294134, 106.420191],
  [10.293921, 106.420596],
  [10.2939, 106.420649],
  [10.293862, 106.420749],
  [10.293792, 106.420875],
  [10.293017, 106.422493],
  [10.292829, 106.422886],
  [10.292376, 106.423832],
  [10.291839, 106.424953],
  [10.29157, 106.425514],
  [10.291238, 106.426208],
  [10.290466, 106.427821],
  [10.289868, 106.429077],
  [10.289789, 106.429243],
  [10.289562, 106.429718],
  [10.289498, 106.429853],
  [10.289256, 106.430367],
  [10.288974, 106.430945],
  [10.288739, 106.431425],
  [10.291056, 106.432512],
  [10.291449, 106.432685],
  [10.292277, 106.433047],
  [10.292868, 106.433348],
  [10.293156, 106.433496],
  [10.293326, 106.433602],
  [10.293677, 106.43385],
  [10.293776, 106.433901],
  [10.294108, 106.433999],
  [10.294259, 106.434047],
  [10.294393, 106.434084],
  [10.295731, 106.434575],
  [10.295493, 106.435107],
  [10.295449, 106.435308],
  [10.295464, 106.435529],
  [10.295542, 106.436078],
  [10.295597, 106.436455],
  [10.295622, 106.436747],
  [10.29562, 106.437026],
  [10.295589, 106.437241],
  [10.295453, 106.437609],
];
