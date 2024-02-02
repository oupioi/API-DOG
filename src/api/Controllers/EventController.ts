import express, { Router, Request, Response, NextFunction } from "express";
import { EventBusiness } from "../../api/Business/EventBusiness";
import Event from "../../database/models/Event";
import { EventDTO } from "../../api/RequestBodies/EventDTO";
import { plainToInstance } from "class-transformer";
import { TokenHandler } from "../../api/Tools/TokenHandler";

const router : Router = express.Router();

router.get('/', TokenHandler.handle ,async (req: Request, res: Response, next : NextFunction) => {
        try {
            const eventBusiness: EventBusiness = new EventBusiness();
            const events: {rows: Event[], count: number} = await eventBusiness.getAllEvents();
            res.json({
                total_items: events.count,
                events: events.rows
            });
        }  catch(error) {
            next(error);
        }
    }
)

router.post('/', TokenHandler.handle, async (req: Request, res: Response, next : NextFunction) => {
        try {
            const eventBusiness: EventBusiness = new EventBusiness();
            const eventDto: EventDTO = plainToInstance(EventDTO, req.body);
            const newEvent: Event = await eventBusiness.createEvent(eventDto);
            res.status(201).json(newEvent);
        } catch (error) {
            next(error);
        }
    }
)

router.get('/:id', TokenHandler.handle, async (req: Request, res: Response, next : NextFunction) => {
        try {
            const eventBusiness: EventBusiness = new EventBusiness();
            const event: Event = await eventBusiness.getEvent(parseInt(req.params.id));
            res.json(event);
        } catch (error) {
            next(error);
        }
    }
)

router.put('/:id', TokenHandler.handle, async (req: Request, res: Response, next : NextFunction) => {
        try {
            const eventBusiness: EventBusiness = new EventBusiness();
            const eventDto: EventDTO = plainToInstance(EventDTO, req.body);
            const event: Event = await eventBusiness.modifyEvent(parseInt(req.params.id), eventDto);
            res.status(200).json(event);
        } catch (error) {
            next(error);
        }
    }
)

export default router;


