import Friend from "../../database/models/Friend";
import { FriendDTO } from "../../api/RequestBodies/FriendDTO";
import express, { NextFunction, Request, Response, Router } from "express";
import { plainToInstance } from "class-transformer";
import { FriendBusiness } from "../../api/Business/FriendBusiness";
import { TokenHandler } from "../Tools/TokenHandler";


const router: Router = express.Router();
const friendBusiness : FriendBusiness = new FriendBusiness();

/**
 * Route to search friends of a user by its given id
 */
router.get("/:id",TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const friends: Friend[] = await friendBusiness.getAllfriend(parseInt(req.params.id));
        res.json(friends);
    }catch(err){
        next(err);
    }
});

/**
 * Route to search a relation between two users
 */
router.get("/:id1",TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try{
        const realation : Friend = await friendBusiness.getFriendship(TokenHandler.tokenUserId, parseInt(req.params.id1));
        res.json(realation);
    }catch(err){
        next(err);
    }
});


/**
 * Route to create a friend request
 */
router.post("/",TokenHandler.handle, async (req: Request, res: Response, next) => {
    try {
        const friendDto: FriendDTO = plainToInstance(FriendDTO, req.body);
        const newfriend: Friend = await friendBusiness.createFriendRequest(friendDto);
        const friend : Friend = await Friend.findOne({
            where :{
                userId1: newfriend.userId1,
                userId2: newfriend.userId2
            }  
        })
        res.json(friend);
    } catch (error) {
        next(error);
    }
});

/**
 * Route to accept a friendship
 */
router.post("/:id1/:id2",TokenHandler.handle, async (req: Request, res: Response, next) => {
    try {
        const friend : Friend = await friendBusiness.acceptFriendRequest(parseInt(req.params.id1), parseInt(req.params.id2));
        res.json(friend);
    } catch (error) {
        next(error);
    }
});
/**
 * Route to reject a friendship
 */
router.post("/reject/:id1/:id2",TokenHandler.handle,async (req: Request, res: Response, next) => {
    try {
        const friend : Friend = await friendBusiness.rejectFriendRequest(parseInt(req.params.id1), parseInt(req.params.id2));
        res.json(friend);
    }catch(err){
        next(err);
    }
});
/**
 * Route to delete a friendship
 */
router.delete("/:id1/:id2",TokenHandler.handle, async (req: Request, res: Response, next) => {
    try{
        const result : void = await friendBusiness.deleteFriend(parseInt(req.params.id1), parseInt(req.params.id2));
        res.status(200).json({
            message: "Friendship deleted"
        });
    }catch(err){
        next(err);
    }
});
export default router;
