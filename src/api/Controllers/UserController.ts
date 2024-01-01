import { UserDTO } from "../RequestBodies/UserDTO";
import User from "../../database/models/User";
import express, { Request, Response, Router } from "express";
import { plainToInstance } from "class-transformer";
import { UserBusiness } from "../Business/UserBusiness";

const router: Router = express.Router();
const userBusiness: UserBusiness = new UserBusiness();

router.get('/', (req: Request, res: Response) => {
    userBusiness.getAllUsers().then((result) => {
        res.json({
            total_items: result.count,
            users: result.rows
        });
    })
});

router.get('/:id', (req, res, next) => {
    try {
        userBusiness.getUserById(parseInt(req.params.id)).then((user) => {
            res.json(user);
        })
    }catch(err) {
        next(err);
    }
});

router.post("/", async (req: Request, res: Response, next) => {
    try {
        const userDto: UserDTO = plainToInstance(UserDTO, req.body);
        const newUser: User = await userBusiness.createUser(userDto);
        User.findByPk(newUser.id).then((user: User) => {
            res.json(user);
        })
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req: Request, res: Response, next) => {
    try {
        const userDto: UserDTO = plainToInstance(UserDTO, req.body);
        //Ajouter un middleware pour check si c'est bien le bon utilisateur (dans le token) et/ou mettre uuid
        const user: User = await userBusiness.modifyUser(userDto);
        const userFound: User = await User.findByPk(user.id);
        res.json(userFound);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', (req: Request, res: Response, next) => {
    userBusiness.deleteUser(parseInt(req.params.id)).then((result: void) => {
        res.status(204);
    }).catch((err) => {next(err);});
});

export default router;