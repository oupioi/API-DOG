import Friend, { FriendRequestStatuses } from "../../database/models/Friend"
import { CustomError } from "../../api/Tools/ErrorHandler";
import { Op } from "sequelize";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import { UserBusiness } from "./UserBusiness";
import User from "../../database/models/User";
import { PendingFriendRequest } from "../../api/ResponseBodies/PendingFriendRequestsDTO";


export class FriendBusiness {
    /**
     * 
     * @param friendDto FriendDTO
     * @returns The new friend
     */
    public async createFriendRequest(targetUserId: number): Promise<Friend>
    {
        const userId = TokenHandler.tokenUserId;
        if (userId === targetUserId) {
            throw new CustomError("You can't add yourself as friend", 403);
        }

        const friend: Friend|null = await Friend.findOne({
            where: {
                userId1: targetUserId,
                userId2: userId 
            }
        })

        // Friendship already pending
        if (friend) {
            friend.status = FriendRequestStatuses.accepted;
            await friend.save();
            return;
        }

        const userBusiness = new UserBusiness();
        // User exists
        const targetUser = await userBusiness.getUserById(targetUserId);

        if (targetUser) {
            const newfriend = await Friend.create({
                userId1: userId,
                userId2: targetUserId,
                status: FriendRequestStatuses.pending
            });
            return newfriend;
        }
    }

    /**
     * 
     * @param id User id
     * @returns All friend of the user
     */
    public async getFriends()
    {
        const userId = TokenHandler.tokenUserId;
        const friendsFound: {count: number, rows: Friend[]} = await Friend.findAndCountAll({
            where :{
                [Op.and]: [
                    {
                        [Op.or]: [
                            { userId1: userId },
                            { userId2: userId }
                        ]
                    },
                    {status: FriendRequestStatuses.accepted}
                ]
            },
            include: [{model: User, as: 'user1'}, {model: User, as: 'user2'}]
        })
        let rows: any[] = [];

        friendsFound.rows.map((friend) => {
            switch (friend.userId1) {
                case userId:
                    rows.push({
                        id: friend.user2.id,
                        firstname: friend.user2.firstName,
                        lastname: friend.user2.firstName,
                        pseudo: friend.user2.pseudo
                    })
                    break;
            
                default:
                    rows.push({
                        id: friend.user1.id,
                        firstname: friend.user1.firstName,
                        lastname: friend.user1.firstName,
                        pseudo: friend.user1.pseudo
                    })
                    break;
            }
        })
        
        return {
            count: friendsFound.count,
            rows: rows
        };
    }

    /**
     * 
     * @param userId1 User who send the request
     * @param userId2 User who receive the request
     * @returns The new friend
     */
    public async changeRequestStatus(targetUserId: number, status: FriendRequestStatuses): Promise<Friend> {
        const userId = TokenHandler.tokenUserId;
        const friend: Friend | null = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId1: userId, userId2: targetUserId },
                    { userId1: targetUserId, userId2: userId }
                ]
            }
        });

        if (!friend) {
            throw new CustomError("Friend not found", 404);
        }

        friend.status = status;
        await friend.save();

        return friend;
    }

    public async getPendingRequests()
    {
        // let pendingRequests: PendingFriendRequest[]|[] = [];
        let pendingRequests: any[] = [];
        const userId = TokenHandler.tokenUserId;
        const friends: {count: number, rows: Friend[]} = await Friend.findAndCountAll({
            where :{
                [Op.and]: [
                    {
                        [Op.or]: [
                            { userId1: userId },
                            { userId2: userId }
                        ]
                    },
                    {status: FriendRequestStatuses.pending}
                ]
            },
            include: [{model: User, as: 'user1'}, {model: User, as: 'user2'}]
        });
        
        friends.rows.map((friend) => {
            switch (friend.userId1) {
                case userId:
                    pendingRequests.push({
                        id: friend.user2.id,
                        firstname: friend.user2.firstName,
                        lastname: friend.user2.firstName,
                        pseudo: friend.user2.pseudo,
                        received: false
                    })
                    break;
            
                default:
                    pendingRequests.push({
                        id: friend.user1.id,
                        firstname: friend.user1.firstName,
                        lastname: friend.user1.firstName,
                        pseudo: friend.user1.pseudo,
                        received: true
                    })
                    break;
            }
        });
        return pendingRequests;
    }

    /**
     * 
     * @param userId1 User who send the request
     * @param userId2 User who receive the request
     * @returns Error if the request doesn't exist or the request deleted
     */
    public async deleteFriend(targetUserId: number) {
        const userId = TokenHandler.tokenUserId;
        const friend: Friend|null = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId1: userId, userId2: targetUserId },
                    { userId1: targetUserId, userId2: userId }
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