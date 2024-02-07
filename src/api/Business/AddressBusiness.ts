import { AddressDTO } from "../RequestBodies/AddressDTO";
import Address from "../../database/models/Address";

export class AddressBusiness {
    public async createAddress(addressDto: AddressDTO): Promise<Address>
    {
        try {
            const newAddress = await Address.create({
                address: addressDto.address,
                zipCode: addressDto.zipCode,
                city: addressDto.city
            })
            return newAddress;
        } catch {
            throw new Error("Couldn't create address");
        }
    }

    public async modifyAddress(idAddress: number, addressDto: AddressDTO): Promise<Address>
    {
        let address: Address = await Address.findByPk(idAddress);
        address.address = addressDto.address;
        address.zipCode = addressDto.zipCode;
        address.city = addressDto.city;

        await address.save();
        return address;
    }

    public async modifyUserAddress(address: Address, addressDto: AddressDTO): Promise<Address>
    {
        const addressChanged: boolean = address.address != addressDto.address || address.zipCode != addressDto.zipCode || address.city != addressDto.city;
        if (addressChanged) {
            address.address = addressDto.address;
            address.zipCode = addressDto.zipCode;
            address.city = addressDto.city;
            address.save();
        }
        return address;
    }
}