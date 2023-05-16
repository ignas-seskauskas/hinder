import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Node, Route, TravellingMethod } from "../../interfaces/Route";
import L from "leaflet";
import "leaflet-routing-machine";
import "./route-without-names.css";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-geosearch/dist/geosearch.css";
import { Button, Form, InputGroup } from "react-bootstrap";

const API_KEY = "***";

interface Place {
  properties: {
    name: string;
    lat: number;
    lon: number;
  };
}

interface GeoJSONFeature {
  type: string;
  properties: object;
  geometry: object;
}

const RoutePage = () => {
  const URL = "http://localhost:3000/routes";
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRoutesFinished, setIsRoutesFinished] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [placesData, setPlacesData] = useState<Place[]>([]);
  const { state } = useLocation();
  const mapObjRef = useRef<L.Map | null>(null);
  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  const markerRef = useRef<L.Marker | null>(null);
  const [travelMethod, setTravelMethod] = useState<TravellingMethod | null>(
    null,
  );
  const [nodes, setNodes] = useState<Node[]>([]);
  useEffect(() => {
    const map = L.map(mapRef.current!).setView([51.505, -0.09], 13);
    mapObjRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    //const geoJsonLayer = L.geoJSON(
    //  searchResults.map((result) => result.geojson),
    //);
    //geoJsonLayer.addTo(map);

    map.getContainer().style.cursor = "crosshair";

    function onMapClick(e: L.LeafletMouseEvent) {
      if (markerRef.current === null) {
        const marker = L.marker(e.latlng, { icon: greenIcon }).addTo(map);
        marker.bindPopup("Chosen start point");
        markerRef.current = marker;
      } else {
        markerRef.current.setLatLng(e.latlng);
        console.log(markerRef.current.getLatLng());
      }
    }

    map.on("click", onMapClick);
    return () => {
      map.off();
      map.remove();
    };
  }, []);

  useEffect(() => {
    const markers: L.Marker[] = [];
    placesData.forEach((place) => {
      const marker = L.marker([place.properties.lat, place.properties.lon])
        .addTo(mapObjRef.current!);
      marker.bindPopup(place.properties.name);
      markers.push(marker);
    });

    if (markers.length >= 2) {
      const routeControl = L.Routing.control({
        waypoints: [],
        show: false,
      }).addTo(mapObjRef.current!);
      const mode = travelMethod || "walk";
      const waypoints = markers.map((marker: L.Marker) => {
        const { lat, lng } = marker.getLatLng();
        nodes.push({ coordX: lat, coordY: lng });
        return { "location": [lng, lat] };
      });
      setNodes(nodes);
      const body = {
        "mode": mode,
        "waypoints": waypoints,
      };
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.geoapify.com/v1/mapmatching?apiKey=${API_KEY}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body),
            },
          );
          const data = await response.json();
          console.log(data);

          const routes = data.features.map((feature: GeoJSONFeature) => ({
            type: "Feature",
            properties: {},
            geometry: feature.geometry,
          }));

          console.log(routes);
          const geojsonLayer = L.geoJSON(routes).addTo(
            mapObjRef.current!,
          );
          mapObjRef.current!.fitBounds(geojsonLayer.getBounds());
          setIsRoutesFinished(true);
        } catch (error) {
          console.error("Error fetching route data:", error);
        }
      };

      fetchData();
    }
  }, [placesData]);

  let content;

  if (state.action === "create") {
    function getPlaces() {
      if (markerRef.current === null) {
        alert("Put marker");
        return;
      }
      const { lat, lng } = markerRef.current.getLatLng();
      const places_max = 5;
      console.log(lat);
      console.log(lng);
      const fetchData = async () => {
        try {
          const response = await fetch(
            `https://api.geoapify.com/v2/places?categories=tourism,natural,national_park&bias=proximity:${lng},${lat}&limit=${places_max}&apiKey=${API_KEY}`,
          );
          const data = await response.json();
          setPlacesData(data.features);
          console.log(data);
        } catch (error) {
          console.error("Error fetching interesting places data:", error);
        }
      };
      fetchData();
    }

    const createRoute = (e: SyntheticEvent) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      const name = (target.elements.namedItem(
        "name",
      ) as HTMLInputElement).value;
      const distance = (target.elements.namedItem(
        "distance",
      ) as HTMLInputElement).value;
      const travellingMethod = (target.elements.namedItem(
        "travellingMethod",
      ) as HTMLInputElement).value;
      const travMet = travellingMethod as TravellingMethod;
      setTravelMethod(travMet);
      const newRoute: Route = {
        id: Date.now(),
        name: name,
        distance: distance,
        travellingMethod: travMet,
        rating: 0,
        nodes: nodes,
      };
      setNodes([]);

      console.log(newRoute);

      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoute),
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            console.log("DB updated");
          }
          return response.json();
        })
        .then((data) => {
          setErrorMessage(data.error);
        });
    };

    content = (
      <div>
        <Form onSubmit={createRoute}>
          <h3 className="pt-3 text-danger">{errorMessage}</h3>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <Form.Group controlId="distance">
            <Form.Label>Distance</Form.Label>
            <Form.Control type="text" />
          </Form.Group>
          <div>
            <label htmlFor="travellingMethod" className="form-label">
              Travel method
            </label>
            <select className="form-control" name="travellingMethod">
              <option value="">-- Select an option --</option>
              <option value={TravellingMethod.Walk}>
                {TravellingMethod.Walk}
              </option>
              <option value={TravellingMethod.Bicycle}>
                {TravellingMethod.Bicycle}
              </option>
              <option value={TravellingMethod.Drive}>
                {TravellingMethod.Drive}
              </option>
            </select>
          </div>
          <br />
          {isRoutesFinished && (
            <Button variant="primary" type="submit">
              Add New Route
            </Button>
          )}
        </Form>
        <div ref={mapRef} style={{ height: "400px", width: "600px" }} />
        <button onClick={getPlaces}>
          Get interesting places
        </button>
      </div>
    );
  } else if (state.action === "view") {
    const [newRating, setNewRating] = useState(state.route.rating);
    const rateRoute = (e: SyntheticEvent) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      const rating = (target.elements.namedItem(
        "rating",
      ) as HTMLInputElement).value;
      const newRoute = state.route;
      newRoute.rating = rating;

      fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoute),
      })
        .then((response) => {
          console.log(response);
          if (response.ok) {
            console.log("DB updated");
          }
          return response.json();
        })
        .then((data) => {
          setErrorMessage(data.error);
        });
    };
    content = (
      <div>
        <Form onSubmit={rateRoute}>
          <h3 className="pt-3 text-danger">{errorMessage}</h3>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={state.route.name}></Form.Control>
          </Form.Group>
          <Form.Group controlId="rating">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="text"
              value={newRating}
              onChange={(e) =>
                setNewRating(
                  e.target.value,
                )}
            >
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="distance">
            <Form.Label>Distance</Form.Label>
            <Form.Control type="text" value={state.route.distance}>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="travellingMethod">
            <Form.Label>Travel method</Form.Label>
            <Form.Control type="text" value={state.route.travellingMethod}>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit rating
          </Button>
        </Form>
        <div ref={mapRef} style={{ height: "400px", width: "600px" }} />
      </div>
    );
  }
  return <div>{content}</div>;
};
export default RoutePage;
