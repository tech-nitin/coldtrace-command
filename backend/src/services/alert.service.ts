import { Alert } from '../models/Alert.js';
import Shipment from '../models/Shipment.js';

export const evaluateTelemetryAlerts = async (
  deviceId: string,
  shipmentId: string,
  temperature: number,
  humidity?: number
) => {
  try {
    // 1. Find shipment using the correct field
    const shipment = await Shipment.findOne({ shipmentId });

    if (!shipment) {
      console.warn(
        `[Alert] Shipment not found for shipmentId: ${shipmentId}`
      );
      return null;
    }

    // 2. Get shipment temperature thresholds
    const {
      minTemp = 2.0,
      maxTemp = 8.0,
    } = shipment.thresholds || {};

    let alertTriggered = false;

    let alertType: 'TEMP_EXCEEDED' | 'TEMP_TOO_LOW' =
      'TEMP_EXCEEDED';

    let thresholdLimit = maxTemp;

    let severity: 'HIGH' | 'CRITICAL' = 'HIGH';

    // 3. Check upper temperature limit
    if (temperature > maxTemp) {
      alertTriggered = true;

      alertType = 'TEMP_EXCEEDED';

      thresholdLimit = maxTemp;

      severity =
        temperature > maxTemp + 5
          ? 'CRITICAL'
          : 'HIGH';
    }

    // 4. Check lower temperature limit
    else if (temperature < minTemp) {
      alertTriggered = true;

      alertType = 'TEMP_TOO_LOW';

      thresholdLimit = minTemp;

      severity =
        temperature < minTemp - 3
          ? 'CRITICAL'
          : 'HIGH';
    }

    // 5. No temperature breach
    if (!alertTriggered) {
      return null;
    }

    // 6. Prevent duplicate active alerts
    const existingAlert = await Alert.findOne({
      shipmentId,
      deviceId,
      alertType,
      status: 'ACTIVE',
    }).sort({ createdAt: -1 });

    // If an active alert of the same type already exists,
    // update it instead of creating unlimited alerts
    if (existingAlert) {
      existingAlert.readingValue = temperature;
      existingAlert.thresholdLimit = thresholdLimit;
      existingAlert.severity = severity;

      await existingAlert.save();

      return existingAlert;
    }

    // 7. Create alert message
    const message =
      `Temperature breach detected! Current: ${temperature}°C ` +
      `(Allowed range: ${minTemp}°C - ${maxTemp}°C)`;

    // 8. Create new alert
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

    // 9. Mark shipment as CRITICAL
    shipment.status = 'CRITICAL';

    await shipment.save();

    console.log(
      `[Alert] ${severity} alert created for shipment: ${shipmentId}`
    );

    return newAlert;
  } catch (error) {
    console.error(
      '[Alert Service Error]',
      error
    );

    return null;
  }
};