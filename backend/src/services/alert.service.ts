import { Alert } from '../models/Alert.js';
import { Shipment } from '../models/Shipment.js';

export const evaluateTelemetryAlerts = async (
  deviceId: string,
  shipmentId: string,
  temperature: number,
  humidity: number
) => {
  // 1. Fetch active shipment details and its temperature limits
  const shipment = await Shipment.findOne({ shipmentCode: shipmentId });
  if (!shipment) return null;

  const { min, max } = shipment.tempThresholds || { min: 2.0, max: 8.0 };

  let alertTriggered = false;
  let alertType: 'TEMP_EXCEEDED' | 'TEMP_TOO_LOW' = 'TEMP_EXCEEDED';
  let thresholdLimit = max;
  let severity: 'HIGH' | 'CRITICAL' = 'HIGH';

  // 2. Check upper limit breach
  if (temperature > max) {
    alertTriggered = true;
    alertType = 'TEMP_EXCEEDED';
    thresholdLimit = max;
    severity = temperature > max + 5 ? 'CRITICAL' : 'HIGH';
  } 
  // 3. Check lower limit breach
  else if (temperature < min) {
    alertTriggered = true;
    alertType = 'TEMP_TOO_LOW';
    thresholdLimit = min;
    severity = temperature < min - 3 ? 'CRITICAL' : 'HIGH';
  }

  // 4. Save alert & update shipment status if breached
  if (alertTriggered) {
    const message = `Temperature breach detected! Current: ${temperature}°C (Limit: ${min}°C - ${max}°C)`;
    
    const newAlert = await Alert.create({
      shipmentId,
      deviceId,
      alertType,
      severity,
      message,
      readingValue: temperature,
      thresholdLimit,
      status: 'ACTIVE',
    });

    // Mark shipment status as COMPROMISED
    shipment.status = 'COMPROMISED';
    await shipment.save();

    return newAlert;
  }

  return null;
};