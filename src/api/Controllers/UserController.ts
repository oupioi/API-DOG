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

router.get('/:id', (req, res) => {
    userBusiness.getUserById(parseInt(req.params.id)).then((user) => {
        res.json(user);
    })
});

router.post("/", async (req: Request, res: Response) => {
    const userDto: UserDTO = plainToInstance(UserDTO, req.body);

    userBusiness.createUser(userDto).then((newUser: User) => {
        User.findByPk(newUser.id).then((user: User) => {
            res.json(user);
        })
    });
});


router.put('/:id', (req: Request, res: Response) => {
    const userDto: UserDTO = plainToInstance(UserDTO, req.body);
    //Ajouter un middleware pour check si c'est bien le bon utilisateur (dans le token) et/ou mettre uuid
    userBusiness.modifyUser(userDto).then((user: User) => {
        User.findByPk(user.id).then((userFound: User) => {
            res.json(userFound);
        })
    })

});

router.delete('/:id', (req: Request, res: Response) => {
    userBusiness.deleteUser(parseInt(req.params.id)).then((result: void) => {
        res.status(204);
    });
});

export default router;