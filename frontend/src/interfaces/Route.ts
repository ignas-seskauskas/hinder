export interface Nore {
    coordX: number;
    coordY: number;
}

export enum TravellingMethod {
    Walk = 'walk',
    Bicycle = 'bicycle',
    Drive = 'drive',
}

export interface Route {
  id: number;
  name: string;
  distance: string;
  travellingMethod: TravellingMethod;
  rating: number;
  nodes: Node[];
}

export default Route;
