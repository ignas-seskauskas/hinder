import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Route, TravellingMethod } from "../entity/Route";
import { Node } from "../entity/Node";
import axios from "axios";
import * as dotenv from "dotenv";

export class RouteController {
  private API_KEY = process.env.MAP_API_KEY;
  private PLACES_URL = process.env.MAP_PLACES_URL;
  private ROADS_URL = process.env.MAP_ROADS_URL;
  private routeRepository = AppDataSource.getRepository(Route);
  private nodeRepository = AppDataSource.getRepository(Node);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.routeRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    const route = await this.routeRepository.findOne({
      where: { id },
    });

    if (!route) {
      return "route not found";
    }

    const nodes: Node[] = await this.nodeRepository.find({
      where: {
        route: route
      }
    })
    route.nodes = nodes;

    let res = {};
    if (nodes.length > 0) {
      const waypoints = await route.nodes.map((node) => {
        const { coordY: lon, coordX: lat } = node;
        return { "location": [lon, lat] };
      });
      const payloadData = {
        "mode": route.travellingMethod,
        "waypoints": waypoints,
      };
      const roads = await this.getRoads(request, response, next, payloadData);
      res = { route: route, roads: roads };
    } else {
      res = { route: route, roads: [] };
    }

    return res;
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const updatedRoute: Route = request.body;

    const route = await this.routeRepository.findOne({
      where: { id: updatedRoute.id },
    });

    if (!route) {
      return "route not found";
    }

    const isValid = this.validateData(updatedRoute, response);
    if (!isValid) {
      return;
    }

    route.rating = parseInt(request.body.rating);

    return this.routeRepository.save(route);
  }


  async create(request: Request, response: Response, next: NextFunction) {
    const routeData: Route = request.body.newRoute;
    routeData.distance = Number(routeData.distance);

    const { lat: startLat, lng: startLng } = request.body.startPosition;

    const isValid = this.validateData(routeData, response);
    if (!isValid) {
      return;
    }

    const locationData = await this.getLocationData(request, response, next, startLat, startLng);

    const nodes = [];
    const mode = routeData.travellingMethod || TravellingMethod.Drive;
    const waypoints = await locationData.features.map((feat) => {
      const { lon, lat } = feat.properties;
      nodes.push({ coordX: lat, coordY: lon });
      return { "location": [lon, lat] };
    });
    nodes.unshift({ coordX: startLat, coordY: startLng });
    waypoints.unshift({ "location": [startLng, startLat] });

    const payloadData = {
      "mode": mode,
      "waypoints": waypoints,
    };
    const roads = await this.getRoads(request, response, next, payloadData);

    const res = { roads: roads, nodes: nodes };

    return res;
  }

  async submit(request: Request, response: Response, next: NextFunction) {
    const routeData: Route = request.body;

    const isValid = this.validateData(routeData, response);
    if (!isValid) {
      return;
    }

    const route = await this.routeRepository.save(routeData);

    const nodes = routeData.nodes.map((node) => {
      return this.nodeRepository.create({
        coordX: node.coordX,
        coordY: node.coordY,
        route: route,
      });
    });
    await this.nodeRepository.save(nodes);

    return JSON.stringify("success");
  }

  private validateData(route: Route, response: Response): boolean {
    const errCode = 418;
    let isValid = true;
    let errMessage = "";

    if (route.name === "") {
      errMessage = "Empty name";
    } else if (route.distance <= 0) {
      errMessage = "Incorrect distance value";
    } else if (!route.travellingMethod) {
      errMessage = "Empty travelling method";
    } else if (0 > route.rating || route.rating > 10) {
      errMessage = "Rating is over interval limits (0-10)";
    }

    if (errMessage) {
      response.status(errCode).json({ error: errMessage });
      isValid = false;
    }

    return isValid;
  }

  private async getLocationData(request: Request, response: Response, next: NextFunction, lat: number, lng: number) {
    const placesMax = 5;
    const placesUrl = this.PLACES_URL + `?categories=tourism,natural,national_park&bias=proximity:${lng},${lat}&limit=${placesMax}&apiKey=${this.API_KEY}`;

    try {
      const fetchRes = await axios.get(
        placesUrl,
      );
      const data = await fetchRes.data;
      return data;
    } catch (error) {
      const errMessage = "Error fetching location data:";
      response.status(500).send(errMessage);
    }
  }

  private async getRoads(request: Request, response: Response, next: NextFunction, payloadData) {
    const roadsUrl = this.ROADS_URL + `?apiKey=${this.API_KEY}`;

    try {
      const fetchRes = await axios(
        {
          method: 'post',
          url: roadsUrl,
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify(payloadData),
        });
      const data = await fetchRes.data;
      return data;
    } catch (error) {
      const errMessage = "Error fetching roads";
      response.status(500).send(errMessage);
    }
  }

  private dist(point1, point2) {
    const { lng: lon1, lat: lat1 } = point1;
    const { lng: lon2, lat: lat2 } = point2;
    const earthRad = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const dist = earthRad * c;
    return dist;
  }
}
