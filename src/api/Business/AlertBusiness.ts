import { AlertDTO } from "api/RequestBodies/AlertDTO";
import { CustomError } from "../../api/Tools/ErrorHandler";
import Alert from "../../database/models/Alert";

export class AlertBusiness {
    /**
     * Create new alert
     * @param alertDto 
     * @returns PromiseAlert>
     * @throws CustomError
     */
    public async createAlert(alertDto: AlertDTO): Promise<Alert> {
        try {
            const newAlert = await Alert.create({
                title: alertDto.title,
                context: alertDto.context,
                content: alertDto.content,
                zip_code: alertDto.zip_code
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
     * Modify an Alert
     * @param alertDto 
     * @returns Alert
     */
    public async modifyAlert(alertDto: AlertDTO) 
    {
        let alert: Alert = await Alert.findByPk(alertDto.id);

        if(!alert) {
            throw new CustomError("Not found", 404);
        }
        alert.title     = alertDto.title;
        alert.context   = alertDto.context;
        alert.content   = alertDto.content;
        alert.zip_code  = alertDto.zip_code;

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