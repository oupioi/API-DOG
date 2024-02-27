import express, { Router, Request, Response, NextFunction } from "express";
import { EventBusiness } from "../../api/Business/EventBusiness";
import Event from "../../database/models/Event";
import { EventDTO } from "../../api/RequestBodies/EventDTO";
import { plainToInstance } from "class-transformer";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import EventUser from "../../database/models/EventUser";

const eventBusiness: EventBusiness = new EventBusiness();
const router: Router = express.Router();

router.get('/', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events: { rows: Event[], count: number } = await eventBusiness.getAllEvents();
        res.json({
            total_items: events.count,
            events: events.rows
        });
    } catch (error) {
        next(error);
    }
}
)

router.get('/future', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await eventBusiness.getFutureEvents();
        res.json(events);
    } catch (error) {
        next(error); 
    }
}
)

router.get('/past', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await eventBusiness.getPastEvents();
        res.json(events);
    } catch (error) {
        next(error);
    }
}
)

router.get('/user', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const events = await eventBusiness.getUserEvents(TokenHandler.tokenUserId);
        res.json(events);
    } catch (error) {
        next(error);
    }
}
)


router.post('/', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventDto: EventDTO = plainToInstance(EventDTO, req.body);
        const newEvent: Event = await eventBusiness.createEvent(eventDto);
        res.status(201).json(newEvent);
    } catch (error) {
        next(error);
    }
}
)

router.get('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event: Event = await eventBusiness.getEvent(parseInt(req.params.id));
        res.json(event);
    } catch (error) {
        next(error);
    }
}
)

router.put('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {

        const eventDto: EventDTO = plainToInstance(EventDTO, req.body);
        const event: Event = await eventBusiness.modifyEvent(parseInt(req.params.id), eventDto);
        res.status(200).json(event);
    } catch (error) {
        next(error);
    }
}
)

router.post('/join/:id_event', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    console.log(TokenHandler.tokenUserId, parseInt(req.params.id_event));
    try {
        const eventUser: EventUser = await eventBusiness.addUserEvent(TokenHandler.tokenUserId, parseInt(req.params.id_event));
        res.status(201).send(eventUser);
    } catch (error) {
        next(error);
    }
}
)

router.delete('/:id_event', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        await eventBusiness.deleteEvent(parseInt(req.params.id_event));
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}
)

export default router;


