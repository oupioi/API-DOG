import { UserDTO } from "../RequestBodies/UserDTO";
import User from "../../database/models/User";
import express, { NextFunction, Request, Response, Router } from "express";
import { plainToInstance } from "class-transformer";
import { UserBusiness } from "../Business/UserBusiness";
import { TokenHandler } from "../../api/Tools/TokenHandler";

const router: Router = express.Router();
const userBusiness: UserBusiness = new UserBusiness();

router.get('/',  TokenHandler.handle, async (req: Request, res: Response, next:NextFunction) => {
    try {
        const users: { rows: User[]; count: number; } = await userBusiness.getAllUsers();
        res.json({
            total_items: users.count,
            users: users.rows
        });
    } catch (error) {
        next(error);
    }
    
});

router.get('/search/:query', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users: { rows: User[]; count: number; } = await userBusiness.searchUserByPseudo(req.params.query);
            res.json({
                total_items: users.count,
                users: users.rows
            });
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
        const token: string = await userBusiness.createUser(userDto);

        res.status(201).json({token: token});
    } catch (error) {
        next(error);
    }
});

router.put('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userDto: UserDTO = plainToInstance(UserDTO, req.body);
        const user: User = await userBusiness.modifyUser(userDto);
        const userFound: User = await User.findByPk(user.id);
        res.json(userFound);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', TokenHandler.handle, (req: Request, res: Response, next: NextFunction) => {
    userBusiness.deleteUser(parseInt(req.params.id)).then((result: void) => {
        res.status(204);
    }).catch((err) => {next(err);});
});

router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userDto: UserDTO = plainToInstance(UserDTO, req.body);
        const token = await userBusiness.login(userDto);
        res.status(200).json({
            token: token
        });
    } catch (error) {
        next(error);
    }
});

export default router;