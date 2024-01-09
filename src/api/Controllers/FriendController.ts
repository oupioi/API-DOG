import Friend from "../../database/models/Friend";
import { FriendDTO } from "../../api/RequestBodies/FriendDTO";
import express, { Request, Response, Router } from "express";
import { plainToInstance } from "class-transformer";
import { FriendBusiness } from "../../api/Business/FriendBusiness";


const router: Router = express.Router();
const friendBusiness : FriendBusiness = new FriendBusiness();
/**
 * Route to search all friend by userId1
 */
router.get("/:id", (req: Request, res: Response) => {
    try{
       friendBusiness.getAllfriend(parseInt(req.params.id)).then((result: Friend[]) => {
            res.json(result);
        }
        ).catch((err) => { throw err; });
    }catch(err){
        throw err;
    }
});



/**
 * Route to create a demande of friend
 */
router.post("/", async (req: Request, res: Response, next) => {
    try {
        const friendDto: FriendDTO = plainToInstance(FriendDTO, req.body);
        const newfriend: Friend = await friendBusiness.createfriend(friendDto);
        Friend.findOne({
            where :{
                userId1: newfriend.userId1,
                userId2: newfriend.userId2
            }  
        }).then((friend: Friend) => {
            res.json(friend);
        })
    } catch (error) {
        next(error);
    }
});

/**
 * Route to accept a friend
 */
router.post("/:id1/:id2", (req: Request, res: Response, next) => {
    friendBusiness.updatefriend(parseInt(req.params.id1), parseInt(req.params.id2)).then((result: Friend) => {
        res.json(result);
    }
    ).catch((err) => { next(err); });
});

/**
 * Route to reject a friend
 */
router.post("/reject/:id1/:id2", (req: Request, res: Response, next) => {
    friendBusiness.rejectfriend(parseInt(req.params.id1), parseInt(req.params.id2)).then((result: Friend) => {
        res.json(result);
    }
    ).catch((err) => { next(err); });
});

/**
 * Route to delete a friend
 */
router.delete("/:id1/:id2", (req: Request, res: Response, next) => {
    friendBusiness.deletefriend(parseInt(req.params.id1), parseInt(req.params.id2)).then((result: Friend) => {
        res.status(204);
    }
    ).catch((err) => { next(err); });
});

export default router;
