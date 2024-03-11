import {EventDTO} from "../RequestBodies/EventDTO";
import Event from "../../database/models/Event";
import EventUser from "../../database/models/EventUser";
import Address from "../../database/models/Address";
import { AddressBusiness } from "./AddressBusiness";
import { TokenHandler } from "../Tools/TokenHandler";
import { Op } from "sequelize";
import { CustomError } from "../../api/Tools/ErrorHandler";
export class EventBusiness {

    private addressBusiness: AddressBusiness;
    private eventUser: EventUser;

    public constructor () {
        this.addressBusiness = new AddressBusiness();
        this.eventUser = new EventUser();
    }

    /**
     * Creates an event
     * @param eventDto Request body
     * @returns
     */
    public async createEvent(eventDto: EventDTO)
    {
        try {
            const address: Address = await this.addressBusiness.createAddress(eventDto.address);
            const newEvent: Event = new Event({
                title: eventDto.title,
                description: eventDto.description,
                maxPeople: eventDto.maxPeople,
                followers: eventDto.followers,
                closed: eventDto.closed,
                date: eventDto.date,
                address: eventDto.address,
                idAddress: address.id,
                founder: TokenHandler.tokenUserId,
            });
            await newEvent.save();
            await this.addUserEvent(TokenHandler.tokenUserId, newEvent.id);
            return await this.getEvent(newEvent.id);
        } catch (error) {
            throw error;
        }
    }


    /**
     * Return every event in database
     * @returns
     */
    public async getAllEvents()
    {
        const events = await Event.findAndCountAll({include:{model: Address, as: 'address'}});
        return events;
    }


    /**
     * Return every event created by the user
     * @returns
     */
    public async getMyEvents()
    {
        const events = await Event.findAndCountAll({where: {founder: TokenHandler.tokenUserId}, include:{model: Address, as: 'address'}});
        return events;
    }

    /**
     * Returns an event by its given id
     * @param id Event id
     * @returns
     */
    public async getEvent(id: number)
    {
        const event = await Event.findByPk(id,{include:{model: Address, as: 'address'}});
        return event;
    }

    /**
     * Deletes an event by its given id
     * @param id Event id
     * @returns
     */
    public async deleteEvent(id: number)
    {
        
        try
        {
            const event = await Event.findByPk(id);
            if (event.founder != TokenHandler.tokenUserId) {
                throw new CustomError("Vous n'avez pas les droits pour supprimer cet événement.");
            }else {
                await event.destroy();
            }
        } catch (error) {
            throw new CustomError("Erreur lors de la suppression de l'événement.");
        }
    }

    /**
     * Returns every user in an event
     * @param id Event id
     * @returns
     */
    public async getUsers(id: number)
    {
        try {
            const users = await EventUser.findAll({
                where: {
                    eventId: id
                }
            });
            return users;
        }
        catch (error) {
            throw new CustomError("Erreur lors de la récupération des utilisateurs de l'événement.");
        }
    }

    /**
     * Adds a user to an event
     * @param userId User id
     * @param eventId Event id 
     * @returns The newly created EventUser object
     */
    public async addUserEvent(userId: number, eventId: number): Promise<EventUser> {
        const existingEventUser = await EventUser.findOne({ where: { userId, eventId } });
        if (existingEventUser) {
            throw new CustomError("L'utilisateur est déjà inscrit à cet événement.");
        }

        const event = await Event.findByPk(eventId);
        if (!event) {
            throw new CustomError("L'événement n'existe pas.");
        }

        if (event.closed) {
            throw new CustomError("L'événement est fermé.");
        }

        const eventUserCount = await EventUser.count({ where: { eventId } });
        if (eventUserCount >= event.maxPeople) {
            throw new CustomError("L'événement est complet.");
        }

        try {
            const newEventUser = new EventUser({
                userId,
                eventId
            });
            await newEventUser.save();
            return newEventUser;
        } catch (error) {
            throw new CustomError("Erreur lors de l'inscription à l'événement.");
        }
    }

    /**
     * Modifies an event
     * @param eventDto Request body
     * @returns
     */
    public async modifyEvent(id: number,eventDto: EventDTO)
    {
        if (await Event.findByPk(id).then(event => event.founder) != TokenHandler.tokenUserId) {
            throw new CustomError("Vous n'avez pas les droits pour modifier cet événement.");
        }
        const event: Event = await Event.findByPk(id);
        event.title = eventDto.title ?? event.title;
        event.description = eventDto.description ?? event.description;
        event.maxPeople = eventDto.maxPeople ?? event.maxPeople;
        event.followers = eventDto.followers ?? event.followers;
        event.closed = eventDto.closed ?? event.closed;
        event.date = eventDto.date  ?? event.date;
        event.allure = eventDto.allure ?? event.allure;
        event.temps = eventDto.temps ?? event.temps;
        event.distance = eventDto.distance ?? event.distance;
        event.public = eventDto.public ?? event.public;

        await this.addressBusiness.modifyAddress(event.idAddress, eventDto.address);
        
        await event.save();
        return event;
    }

    /**
     * Deletes a user from an event
     * @param userId User id
     * @param eventId Event id
     * @returns
     * */
    public async deleteUserEvent(userId: number, eventId: number)
    {
        const eventUser = await EventUser.findOne({
            where: {
                userId: userId,
                eventId: eventId
            }
        });
        await eventUser.destroy();
    }

    /**
     * Returns every event a user is in
     * @param userId User id
     * @returns
     */
    public async getUserEvents(userId: number)
    {
        const events = await EventUser.findAll({
            where: {
                userId: userId
            }
        });
        return events;
    }

    /**
     * Returns every event in past of date of today
     * @returns 
     */
    public async getPastEvents()
    {
        const events = await Event.findAll({
            where: {
                date: {
                    [Op.lt]: new Date()
                }
            },
            include:{model: Address, as: 'address'}
        });
        return events;
    }

    /**
     * Returns every event in future of date of today
     * @returns 
     */
    public async getFutureEvents()
    {
        const events = await Event.findAll({
            where: {
                date: {
                    [Op.gte]: new Date()
                }
            },
            include:{model: Address, as: 'address'}
        });
        return events;
    }
}
