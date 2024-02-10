import { AddressBusiness } from "../../api/Business/AddressBusiness";
import { AddressDTO } from "../../api/RequestBodies/AddressDTO";
import { TokenHandler } from "../../api/Tools/TokenHandler";
import { plainToInstance } from "class-transformer";
import Address from "../../database/models/Address";
import express, { NextFunction, Router, Request, Response } from "express";

const router: Router = express.Router();
const addressBusiness: AddressBusiness = new AddressBusiness();

router.put('/:id', TokenHandler.handle, async (req: Request, res: Response, next: NextFunction) => {
    try {
        const addressDto: AddressDTO = plainToInstance(AddressDTO, req.body);
        const address: Address = await addressBusiness.modifyAddress(addressDto.id, addressDto);

        res.status(200).json(address);
    } catch (error) {
        next(error);
    }
})

export default router;
