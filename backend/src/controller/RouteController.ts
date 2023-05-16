import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Route } from "../entity/Route";
import { Node } from "../entity/Node";

export class RouteController {
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
    return route;
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
}
