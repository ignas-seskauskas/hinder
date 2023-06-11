import { SyntheticEvent, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Node, Route, TravellingMethod } from "../../interfaces/Route";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { Button, Form } from "react-bootstrap";
import LoadingSpinner from "../../components/LoadingSpinner";
import { BASE_API_URL } from "../../constants/api";

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

// TODO: authFetch

const RoutePage = () => {
  const URL = BASE_API_URL + "/routes";
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isRoutesFinished, setIsRoutesFinished] = useState(false);
  const mapHtmlRef = useRef<HTMLDivElement | null>(null);
  const [placesData, setPlacesData] = useState<Place[]>([]);
  const [routeData, setRouteData] = useState<Route | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const isInitialMount = useRef(true);

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
  const [nodes, setNodes] = useState<Node[]>([]);

  // draws map and makes it interactable
  useEffect(() => {
    const map = L.map(mapHtmlRef.current!).setView([51.505, -0.09], 13);
    mapObjRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    map.getContainer().style.cursor = "crosshair";

    function onMapClick(e: L.LeafletMouseEvent) {
      if (markerRef.current === null) {
        const marker = L.marker(e.latlng, { icon: greenIcon }).addTo(map);
        marker.bindPopup("Chosen starting point");
        markerRef.current = marker;
      } else {
        markerRef.current.setLatLng(e.latlng);
      }
    }

    map.on("click", onMapClick);
    return () => {
      map.off();
      map.remove();
    };
  }, []);

  // adds places markers to the map
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const markers: L.Marker[] = [];
      placesData.forEach((place) => {
        const marker = L.marker([place.properties.lat, place.properties.lon])
          .addTo(mapObjRef.current!);
        marker.bindPopup(place.properties.name);
        markers.push(marker);
      });
    }
  }, [placesData]);

  let content;

  if (state.action === "create") {
    const createRoute = (e: SyntheticEvent) => {
      e.preventDefault();
      if (markerRef.current === null) {
        alert("Click on the map for starting point");
        return;
      }

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
      const newRoute: Route = {
        name: name,
        distance: distance,
        travellingMethod: travMet,
        rating: 0,
        nodes: [],
      };
      setRouteData(newRoute);

      const body = { newRoute: newRoute, startPosition: markerRef.current!.getLatLng() };
      setNodes([]);

      const create = async () => {
        setIsLoading(true);

        await fetch(URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        })
          .then((response) => {
            if (response.ok) {
              console.log("DB updated");
            }
            return response.json();
          })
          .then((data) => {
            if (data.error !== undefined) {
              setErrorMessage(data.error);
            } else {
              const features = data.roads.features.map((feature: GeoJSONFeature) => ({
                type: "Feature",
                properties: {},
                geometry: feature.geometry,
              }));
              setNodes(data.nodes);

              const places: Place[] = data.nodes?.map((node: Node) => ({
                properties: { name: "", lat: node.coordX, lon: node.coordY }
              }));
              setPlacesData(places);

              const geojsonLayer = L.geoJSON(features).addTo(
                mapObjRef.current!,
              );
              mapObjRef.current!.fitBounds(geojsonLayer.getBounds());
              setIsRoutesFinished(true);
              setErrorMessage("");
            }
          })
          .catch((err) => {
            console.error(err);
          });

        setIsLoading(false);
      }
      create();
    };

    const submitRoute = (e: SyntheticEvent) => {
      e.preventDefault();
      if (routeData != null) {
        const newRoute: Route = {
          name: routeData.name,
          distance: routeData?.distance,
          travellingMethod: routeData?.travellingMethod,
          rating: 0,
          nodes: nodes,
        };
        setNodes([]);

        fetch(`${URL}/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRoute),
        })
          .then((response) => {
            if (response.ok) {
              console.log("DB updated");
              setIsSubmitted(true);
              alert("Map creation was successful!");
            }
            return response.json();
          })
          .then((data) => {
            setErrorMessage(data.error);
          });
      }
    };

    content = (
      <div>
        <Form onSubmit={createRoute}>
          <h3 className="pt-3 text-danger">{errorMessage}</h3>
          {isLoading &&
            <LoadingSpinner />
          }
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
          {!isRoutesFinished && !isLoading &&
            <Button type="submit">
              Create Route
            </Button>
          }
          {isRoutesFinished && !isSubmitted  && (
            <Button variant="primary" onClick={submitRoute}>
              Submit Route
            </Button>
          )}
        </Form>
        <div ref={mapHtmlRef} style={{ height: "400px", width: "600px" }} />
      </div>
    );
  } else if (state.action === "view") {
    const routeID = state.route.id;
    useEffect(() => {
      const fetchData = async () => {
        const finalURL = `${URL}/${routeID}`
        await fetch(finalURL, {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          return res.json();
        }).then((data) => {
          const route: Route = data.route;

          const places: Place[] = route.nodes?.map((node: Node) => ({
            properties: { name: "", lat: node.coordX, lon: node.coordY }
          }));

          setPlacesData(places);
          const features = data.roads.features.map((feature: GeoJSONFeature) => ({
            type: "Feature",
            properties: {},
            geometry: feature.geometry,
          }));
          
          setNodes(data.nodes);

          const geojsonLayer = L.geoJSON(features).addTo(
            mapObjRef.current!,
          );
          mapObjRef.current!.fitBounds(geojsonLayer.getBounds());
        }).catch((err) => {
          console.error(err);
        });
      }
      fetchData();
    }, []);

    const [newRating, setNewRating] = useState(state.route.rating);

    const rateRoute = (e: SyntheticEvent) => {
      e.preventDefault();
      const target = e.target as HTMLFormElement;
      const rating = (target.elements.namedItem(
        "rating",
      ) as HTMLInputElement).value;
      const newRoute: Route = state.route;
      newRoute.rating = parseInt(rating);

      fetch(URL, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoute),
      })
        .then((response) => {
          if (response.ok) {
            alert("Map rating updated successfully");
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
            <Form.Control type="text" value={state.route.name} disabled></Form.Control>
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
            <Form.Control type="text" value={state.route.distance} disabled>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="travellingMethod">
            <Form.Label>Travel method</Form.Label>
            <Form.Control type="text" value={state.route.travellingMethod} disabled>
            </Form.Control>
          </Form.Group>
          <br />
          <Button variant="primary" type="submit">
            Submit rating
          </Button>
        </Form>
        <div ref={mapHtmlRef} style={{ height: "400px", width: "600px" }} />
      </div>
    );
  }
  return <div>{content}</div>;
};
export default RoutePage;
