import { UserDTO } from "../RequestBodies/UserDTO";
import User, { Roles } from "../../database/models/User";
import express, { NextFunction, Request, Response, Router } from "express";
import { plainToInstance } from "class-transformer";
import { UserBusiness } from "../Business/UserBusiness";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import Address from "../../database/models/Address";

const router: Router = express.Router();
const userBusiness: UserBusiness = new UserBusiness();

router.get('/',  TokenHandler.handle, async (req: Request, res: Response, next:NextFunction) => {
    try {
        const users: { rows: User[]; count: number; } = await userBusiness.getAllUsers();
        res.json({
            total_items:    users.count,
            users:          users.rows
        });
    } catch (error) {
        next(error);
    }
    
});

router.get('/search/:query', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users: { rows: User[]; count: number; } = await userBusiness.searchUserByPseudo(req.params.query);
            res.json({
                total_items:    users.count,
                users:          users.rows
            });
    }catch(err) {
        next(err);
    }
});

router.get('/personal-infos/:id', TokenHandler.handle, TokenHandler.isSameUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User|void = await userBusiness.getUserPersonalInfos(parseInt(req.params.id))
        res.json(user);
    }catch(err) {
        next(err);
    }
});

router.get('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: User|void = await userBusiness.getUserById(parseInt(req.params.id))
        res.json(user);
    }catch(err) {
        next(err);
    }
});

router.post("/", async (req: Request, res: Response, next) => {
    try {
        const userDto: UserDTO = plainToInstance(UserDTO, req.body);
        const user: {id: number, token: string, roles: Roles[]} = await userBusiness.createUser(userDto);

        res.status(201).json({
            user_id:    user.id,
            token:      user.token,
            roles:      user.roles
        });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', TokenHandler.handle, TokenHandler.isSameUser, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userDto: UserDTO = plainToInstance(UserDTO, req.body);
        const user: User = await userBusiness.modifyUser(userDto);
        const userFound: User = await User.findByPk(user.id, {include: {model: Address, as:'address'}});
        res.json(userFound);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user: void = await userBusiness.deleteUser(parseInt(req.params.id));

        res.status(200).json({
            message: "User deleted"
        });
    } catch (error) {
        next(error);
    }

});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userDto: UserDTO = plainToInstance(UserDTO, req.body);
        const user: {id: number, token: string, roles: Roles[]} = await userBusiness.login(userDto);
        res.status(200).json({
            user_id:    user.id,
            token:      user.token,
            roles:      user.roles
        });
    } catch (error) {
        next(error);
    }
});

export default router;