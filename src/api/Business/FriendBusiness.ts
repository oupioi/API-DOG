import Friend from "../../database/models/Friend"
import { FriendDTO } from "../../api/RequestBodies/FriendDTO";
import { CustomError } from "../../api/Tools/ErrorHandler";


export class FriendBusiness {
    /**
     * 
     * @param friendDto FriendDTO
     * @returns The new friend
     */
    public async createfriend(friendDto: FriendDTO): Promise<Friend>
    {
        const newfriend = Friend.create({
            userId1: friendDto.userId1,
            userId2: friendDto.userId2,
            date: friendDto.date,
            status: friendDto.status
        }).then((friend: Friend) => {
            return friend;
        });
        return newfriend;
    }

    /**
     * 
     * @param id User id
     * @returns All friend of the user
     */
    public async getAllfriend(id: number)
    {
        const friends: Friend[] = await Friend.findAll({
            where :{
                userId1: id
            }  
        })
        return friends;
    }


    /**
     * 
     * @param id1 User id 1
     * @param id2 User id 2
     * @returns Friend
     */
    public async getfriend(id1: number,  id2: number)
    {
        const friend: Friend = await Friend.findOne({
            where :{
                userId1 : id1,
                userId2 : id2,
            }
        })
        return friend;
    }

    /**
     * 
     * @param userId1 User who send the request
     * @param userId2 User who receive the request
     * @returns The new friend
     */
    public async updatefriend(userId1: number,userId2: number): Promise<Friend>
    {
        const friend: Friend|null = await Friend.findOne({
            where :{
                userId1: userId1,
                userId2: userId2
            }  
        })
        if (friend === null) {
            throw new CustomError("friend not found");
        }
        friend.status = "accepted";
        await friend.save();
        return friend;
    }

    /**
     * 
     * @param userId1 User who send the request
     * @param userId2 User who receive the request
     * @returns The rejected friend
     */
    public async rejectfriend(userId1: number,userId2: number): Promise<Friend>
    {
        const friend: Friend|null = await Friend.findOne({
            where :{
                userId1: userId1,
                userId2: userId2
            }  
        })
        if (friend === null) {
            throw new CustomError("friend not found");
        }
        friend.status = "rejected";
        await friend.save();
        return friend;
    }


    /**
     * 
     * @param userId1 User who send the request
     * @param userId2 User who receive the request
     * @returns Error if the request doesn't exist or the request deleted
     */
    public async deletefriend(userId1: number,userId2: number) {
        const friend: Friend|null = await Friend.findOne({
            where :{
                userId1: userId1,
                userId2: userId2
            }  
        })
        if (friend === null) {
            throw new CustomError("friend not found");
        }
        await friend.destroy();
        return  "friend deleted";
    }
}