import Address from "../../database/models/Address";
import Sex from "../../database/models/Sex";
import User from "../../database/models/User";
import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.get('/:id', (req, res) => {
    res.json({
        "response": req.params.id
    })
});

router.post("/", async (req: Request, res: Response) => {
    console.log(new Date());
    let date = new Date().toISOString();
    const sexPromise = Sex.findByPk(1).then((sex) => sex.toJSON());
    const addressPromise = Address.findByPk(1).then((address) => address.toJSON());

    const [sex, address] = await Promise.all([sexPromise, addressPromise]);

    res.json({"date": date, "sex": sex, "address": address});

    // Création d'un user en avec une adresse et un sexe déjà existant
    // User.create({
    //     email: "exemple@hotmail.com",
    //     password: "mdpbidon",
    //     firstName: "John",
    //     lastName: "Doe",
    //     birthdate: date,
    //     notifyFriends: false,
    //     idSex: sex.id,
    //     idAddress: address.id
    // }
    // , {
    //     include: [Sex, Address]
    // }
    // )

    // Création d'un user en y ajoutant une nouvelle adresse et un nouveau sexe
    User.create({
        email: "exemple@hotmail.com",
        password: "mdpbidon",
        firstName: "John",
        lastName: "Doe",
        birthdate: date,
        notifyFriends: false,
        sex: sex,
        address: address.id
    }
    , {
        include: [Sex, Address]
    }
    )
})

export default router;