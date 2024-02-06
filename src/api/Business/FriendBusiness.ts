import Friend from "../../database/models/Friend"
import { FriendDTO } from "../../api/RequestBodies/FriendDTO";
import { CustomError } from "../../api/Tools/ErrorHandler";
import { Op } from "sequelize";


export class FriendBusiness {
    /**
     * 
     * @param friendDto FriendDTO
     * @returns The new friend
     */
    public async createFriendRequest(friendDto: FriendDTO): Promise<Friend>
    {
        const newfriend = await Friend.create({
            userId1: friendDto.userId1,
            userId2: friendDto.userId2,
            date: friendDto.date,
            status: friendDto.status
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
        const friends: Friend[]|null = await Friend.findAll({
            where :{
                [Op.or]: [
                    { userId1: id },
                    { userId2: id }
                ]
            }
        })
        return friends;
    }


    /**
     * 
     * @param id1 User id 1
     * @param id2 User id 2
     * @returns Relation between the two users
     */
    public async getFriendship(id1: number,  id2: number)
    {
        const friend: Friend|null = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId1: id1, userId2: id2 },
                    { userId1: id2, userId2: id1 }
                ]
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
    public async acceptFriendRequest(userId1: number, userId2: number): Promise<Friend> {
        const friend: Friend | null = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId1: userId1, userId2: userId2 },
                    { userId1: userId2, userId2: userId1 }
                ]
            }
        });

        if (!friend) {
            throw new CustomError("Friend not found", 404);
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
    public async rejectFriendRequest(userId1: number,userId2: number): Promise<Friend>
    {
        const friend: Friend|null = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId1: userId1, userId2: userId2 },
                    { userId1: userId2, userId2: userId1 }
                ]
            }
        })
        if (friend === null) {
            throw new CustomError("Friend not found", 404);
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
    public async deleteFriend(userId1: number,userId2: number) {
        const friend: Friend|null = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId1: userId1, userId2: userId2 },
                    { userId1: userId2, userId2: userId1 }
                ]
            }  
        })
        if (friend === null) {
            throw new CustomError("Friend not found", 404);
        }
        await friend.destroy();
        return;
    }
}