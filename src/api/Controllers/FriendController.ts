import Friend, { FriendRequestStatuses } from "../../database/models/Friend";
import express, { NextFunction, Request, Response, Router } from "express";
import { FriendBusiness } from "../../api/Business/FriendBusiness";
import { TokenHandler } from "../Tools/TokenHandler";


const router: Router = express.Router();
const friendBusiness : FriendBusiness = new FriendBusiness();

/**
 * Route to search friends of a user by its given id
 */
router.get("",TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const friends: {count: number, rows: Friend[]} = await friendBusiness.getFriends();
        res.json({
            total_items: friends.count,
            friends: friends.rows
        });
    }catch(err){
        next(err);
    }
});

/**
 * Route to get pending requests
 */
router.get("/pending",TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const friends: any = await friendBusiness.getPendingRequests();
        res.json(friends);
    }catch(err){
        next(err);
    }
});

/**
 * Route to create a friend request
 */
router.post("/:targetUserId",TokenHandler.handle, async (req: Request, res: Response, next) => {
    try {
        const newfriend: Friend = await friendBusiness.createFriendRequest(parseInt(req.params.targetUserId));
        res.status(201).json();
    } catch (error) {
        next(error);
    }
});

/**
 * Route to reject a friendship
 */
router.post("/reject/:targetUserId",TokenHandler.handle, async (req: Request, res: Response, next) => {
    try {
        const friend : Friend = await friendBusiness.changeRequestStatus(parseInt(req.params.targetUserId), FriendRequestStatuses.rejected);
        res.json(friend);
    }catch(err){
        next(err);
    }
});

/**
 * Route to delete a friendship
 */
router.delete("/:targetUserId",TokenHandler.handle, async (req: Request, res: Response, next) => {
    try{
        const result : void = await friendBusiness.deleteFriend(parseInt(req.params.targetUserId));
        res.status(200).json({
            message: "Friendship deleted"
        });
    }catch(err){
        next(err);
    }
});
export default router;
