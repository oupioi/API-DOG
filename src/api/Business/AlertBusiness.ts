import { AlertDTO } from "../../api/RequestBodies/AlertDTO";
import { CustomError } from "../../api/Tools/ErrorHandler";
import Alert from "../../database/models/Alert";
import { Op } from "sequelize";

export class AlertBusiness {
    /**
     * Create new alert
     * @param alertDto 
     * @returns Promise<Alert>
     * @throws CustomError
     */
    public async createAlert(alertDto: AlertDTO): Promise<Alert> {
        try {
            const newAlert = await Alert.create({
                title: alertDto.title,
                content: alertDto.content,
                zip_code: alertDto.zip_code,
                createdAt: alertDto.createdAt
            })
            return newAlert;
        } catch {
            throw new CustomError("Couldn't create alert");
        }
    }

    /**
     * Return all alerts
     * @returns Alerts
     */
    public async getAllAlerts() {
        const alerts = await Alert.findAndCountAll();
        return alerts;
    }

    /**
     * Return alert by its id
     * @param id Alert id
     * @returns Alert|null
     */
    public async getAlertById(id: number) {
        let alert: Alert | null = await Alert.findByPk(id);
        return alert;
    }

    /**
     * return alert by zipCode
     * @param zipCode 
     * @returns Alerts
     */
    public async getAlertByZipCode(zip_code: number) {
        const alerts: { rows: Alert[], count: number } = await Alert.findAndCountAll(
            {
                where: {
                    zip_code: {
                        [Op.startsWith]: `${zip_code}`
                    }
                }
            })
        return alerts;
    }

    /**
     * return alert created last n days
     * @param nDays 
     * @returns Alerts
     */
    public async getAlertByCreatedDate(nDays: number) {
        const today = new Date();
        const lastNDays = new Date(today.getTime() - nDays * 24 * 60 * 60 * 1000); // Soustraire 30 jours en millisecondes
        const alerts: { rows: Alert[], count: number } = await Alert.findAndCountAll(
            {
                where: {
                    createdAt: {
                        [Op.gte]: lastNDays
                    }
                }
            }
        )
        return alerts;
    }

    /**
     * Modify an Alert
     * @param alertDto 
     * @returns Alert
     */
    public async modifyAlert(alertDto: AlertDTO) {
        let alert: Alert = await Alert.findByPk(alertDto.id);

        if (!alert) {
            throw new CustomError("Not found", 404);
        }
        alert.title = alertDto.title;
        alert.content = alertDto.content;
        alert.zip_code = alertDto.zip_code;

        await alert.save();
        return await Alert.findByPk(alert.id);
    }

    /**
     * Checks if alert exist by the given id, if yes, delete it
     * @param idAlert 
     */
    public async deleteAlert(idAlert: number) {
        const alert: Alert = await Alert.findByPk(idAlert);
        if (alert) {
            return alert.destroy();
        } else {
            throw new CustomError("Alert not found");
        }
    }
}