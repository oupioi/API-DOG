import {EventDTO} from "../RequestBodies/EventDTO";
import Event from "../../database/models/Event";
import EventUser from "../../database/models/EventUser";
import Address from "../../database/models/Address";
import { AddressBusiness } from "./AddressBusiness";
import { TokenHandler } from "../Tools/TokenHandler";
import { Op } from "sequelize";
import { AddressDTO } from "api/RequestBodies/AddressDTO";
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
       try{
        const address: Address = await this.addressBusiness.createAddress(eventDto.address);
        let newEvent: Event = new Event({
            title:          eventDto.title,
            description:    eventDto.description,
            maxPeople:      eventDto.maxPeople,
            followers:      eventDto.followers,
            closed:         eventDto.closed,
            date:           eventDto.date,
            address:        eventDto.address,
            idAddress:      address.id,
        });
        await newEvent.save();
        if(this.getEvent(newEvent.id)){
            this.addUserEvent(TokenHandler.tokenUserId, newEvent.id);
        }
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
        const event = await Event.findByPk(id);
        await event.destroy();
    }

    /**
     * Returns every user in an event
     * @param id Event id
     * @returns
     */
    public async getUsers(id: number)
    {
        const users = await EventUser.findAll({
            where: {
                idEvent: id
            }
        });
        return users;
    }

    /**
     * Adds a user to an event
     * @param userId User id
     * @param eventId Event id 
     * @returns
     */
    public async addUserEvent(userid: number, eventid: number)
    {
        try {
            const newEventUser = new EventUser({
                userId: userid,
                eventId: eventid
            });
            await newEventUser.save();
            return newEventUser;
        }
        catch (error) {
            throw  new Error("L'utilisateur est déjà inscrit à cet événement.");
        }
    }

    /**
     * Modifies an event
     * @param eventDto Request body
     * @returns
     */
    public async modifyEvent(id: number,eventDto: EventDTO)
    {
        const event: Event = await Event.findByPk(id);
        console.log(event);
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
