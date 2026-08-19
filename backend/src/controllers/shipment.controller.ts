import { Request, Response } from 'express';
import { ShipmentService } from '../services/shipment.service.js';

const shipmentService = new ShipmentService();

export const getMetrics = async (_req: Request, res: Response) => {
  try {
    const metrics = await shipmentService.getDashboardMetrics();
    res.status(200).json({ success: true, data: metrics });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShipments = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const shipments = await shipmentService.getFilteredShipments(
      status as string,
      search as string
    );
    res.status(200).json({ success: true, data: shipments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getShipmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await shipmentService.getShipmentDetails(id);
    res.status(200).json({ success: true, data });
  } catch (error: any) {
    res.status(404).json({ success: false, message: error.message });
  }
};