export interface Coordinates {
  lat: number;
  lng: number;
}

export interface HazardPrediction {
  id: string;
  hazardType: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  locationName: string;
  coordinates: Coordinates;
  description: string;
  recommendedAction: string;
  etaMinutes: number;
}

export interface RouteAnalysisRequest {
  origin: string;
  destination: string;
  distanceText: string;
  durationText: string;
  waypoints: string[];
}