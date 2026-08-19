export interface HealthResult {
  healthIndex: number;
  status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL';
  aiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export const calculateCargoHealth = (
  temp: number,
  humidity: number,
  thresholds: { minTemp: number; maxTemp: number; maxHumidity: number }
): HealthResult => {
  let penalty = 0;

  if (temp > thresholds.maxTemp) {
    penalty += (temp - thresholds.maxTemp) * 15;
  } else if (temp < thresholds.minTemp) {
    penalty += (thresholds.minTemp - temp) * 15;
  }

  if (humidity > thresholds.maxHumidity) {
    penalty += (humidity - thresholds.maxHumidity) * 2;
  }

  const healthIndex = Math.max(0, Math.min(100, Math.round(100 - penalty)));

  let status: 'HEALTHY' | 'AT_RISK' | 'CRITICAL' = 'HEALTHY';
  let aiRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

  if (healthIndex < 50) {
    status = 'CRITICAL';
    aiRiskLevel = 'HIGH';
  } else if (healthIndex < 80) {
    status = 'AT_RISK';
    aiRiskLevel = 'MEDIUM';
  }

  return { healthIndex, status, aiRiskLevel };
};