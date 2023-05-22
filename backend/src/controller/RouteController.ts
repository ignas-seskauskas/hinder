import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Route } from "../entity/Route";
import { Node } from "../entity/Node";
import axios from "axios";
import * as dotenv from "dotenv";

export class RouteController {
  private API_KEY = process.env.MAP_API_KEY;
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

    return route;
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const updatedRoute: Route = request.body;

    const errCount = this.validateData(updatedRoute, response);
    if (errCount > 0) {
      return;
    }

    const route = await this.routeRepository.findOne({
      where: { id: updatedRoute.id },
    });

    if (!route) {
      return "route not found";
    }

    route.rating = parseInt(request.body.rating);

    return this.routeRepository.save(route);
  }


  async save(request: Request, response: Response, next: NextFunction) {
    const routeData: Route = request.body;

    const errCount = this.validateData(routeData, response);
    if (errCount > 0) {
      return;
    }

    const route = Object.assign(new Route(), routeData);

    const nodes = routeData.nodes.map((node) => {
      console.log(node);
      return this.nodeRepository.create({
        coordX: node.coordX,
        coordY: node.coordY,
        route: route,
      });
    });
    this.nodeRepository.save(nodes);

    return this.routeRepository.save(route);
  }

  //async remove(request: Request, response: Response, next: NextFunction) {
  //  const id = parseInt(request.params.id);

  //  let routeToRemove = await this.routeRepository.findOneBy({ id });

  //  if (!routeToRemove) {
  //    return "this route does not exist";
  //  }

  //  await this.deleteOfRoute(id);

  //  await this.routeRepository.remove(routeToRemove);

  //  return "route has been removed";
  //}

  private validateData(route: Route, response: Response): number {
    let errCount = 0;
    const errCode = 418;

    if (route.name === "") {
      response.status(errCode).json({ error: "Empty name" });
      errCount++;
    } else if (route.distance === 0) {
      response.status(errCode).json({ error: "Empty distance" });
      errCount++;
    } else if (!route.travellingMethod) {
      response.status(errCode).json({ error: "Empty travelling method" });
      errCount++;
    } else if (0 > route.rating || route.rating > 10) {
      response.status(errCode).json({
        error: "Rating is over interval limits (0-10)",
      });
      errCount++;
    }

    return errCount;
  }

  //private async deleteOfRoute(id: number) {
  //  await this.userRouteRepository.createQueryBuilder()
  //    .delete()
  //    .where("routeId = :routeId", { routeId: id })
  //    .execute();
  //  await this.routeRepository.createQueryBuilder()
  //    .delete()
  //    .where("routeId = :routeId", { routeId: id })
  //    .execute();
  //}

  async getInterestingPlaces(request: Request, response: Response, next: NextFunction) {
    const places_max = 5;
    const { lng, lat } = request.params;

    try {
      const fetchRes = await axios.get(
        `https://api.geoapify.com/v2/places?categories=tourism,natural,national_park&bias=proximity:${lng},${lat}&limit=${places_max}&apiKey=${this.API_KEY}`,
      );
      const data = await fetchRes.data;
      // setPlacesData(data.features);
      response.send(data);
    } catch (error) {
      const errMessage = "Error fetching interesting places data:";
      console.error(errMessage, error);
      response.status(500).send(errMessage);
    }
  }

  async getRoutes(request: Request, response: Response, next: NextFunction) {
    const API_URL = `https://api.geoapify.com/v1/mapmatching?apiKey=${this.API_KEY}`;
    console.log("req", request.body);
    const body = JSON.stringify(request.body);
    console.log(body);

    try {
      const fetchRes = await axios(
        {
          method: 'post',
          url: API_URL,
          headers: {
            "Content-Type": "application/json",
          },
          data: body,
        });
      //const fetchRes = await axios.post(
      //  API_URL, body
      //    //  {
      //    //    method: "POST",
      //    //    headers: { "Content-Type": "application/json" },
      //    //    body: body,
      //    //  },
      //);
      const data = await fetchRes.data;
      console.log(data);
      // setPlacesData(data.features);
      response.send(data);
    } catch (error) {
      const errMessage = "Error fetching routes:";
      console.error(errMessage, error);
      response.status(500).send(errMessage);
    }
  }

}
