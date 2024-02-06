import {EventDTO} from "../RequestBodies/EventDTO";
import Event from "../../database/models/Event";
import EventUser from "../../database/models/EventUser";
import Address from "../../database/models/Address";
import { AddressBusiness } from "./AddressBusiness";
import { TokenHandler } from "../Tools/TokenHandler";

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
        const events = await Event.findAndCountAll();
        return events;
    }

    /**
     * Returns an event by its given id
     * @param id Event id
     * @returns
     */
    public async getEvent(id: number)
    {
        const event = await Event.findByPk(id);
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
        let newEventUser: EventUser = new EventUser({
            userId : userid,
            eventId: eventid,
        });
        await newEventUser.save();
        return newEventUser;
    }

    /**
     * Modifies an event
     * @param eventDto Request body
     * @returns
     */
    public async modifyEvent(id: number,eventDto: EventDTO)
    {
        const event: Event = await Event.findByPk(id);
        event.title = eventDto.title;
        event.description = eventDto.description;
        event.maxPeople = eventDto.maxPeople;
        event.followers = eventDto.followers;
        event.closed = eventDto.closed;
        event.date = eventDto.date;
        await this.addressBusiness.modifyAddress(event.idAddress, eventDto.address);
        
        await event.save();
        return event;
    }
}