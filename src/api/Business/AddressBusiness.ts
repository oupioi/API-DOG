import { AddressDTO } from "../RequestBodies/AddressDTO";
import Address from "../../database/models/Address";
import axios from "axios";

export class AddressBusiness {
    public async createAddress(addressDto: AddressDTO): Promise<Address> {
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

    public async modifyAddress(idAddress: number, addressDto: AddressDTO): Promise<Address> {
        let address: Address = await Address.findByPk(idAddress);
        address.address = addressDto.address;
        address.zipCode = addressDto.zipCode;
        address.city = addressDto.city;


        return address;
    }

    public async modifyUserAddress(address: Address, addressDto: AddressDTO): Promise<Address> {
        const addressChanged: boolean = address.address != addressDto.address || address.zipCode != addressDto.zipCode || address.city != addressDto.city;
        if (addressChanged) {
            address.address = addressDto.address;
            address.zipCode = addressDto.zipCode;
            address.city = addressDto.city;
            address.save();
        }
        return address;
    }

    /**
     * Get an address from coordinate with OpenStreetMap
     * @param lat latitude
     * @param lon longitude
     * @returns address
     */
    public async getAddressFromCoordinates(lat: number, lon: number) {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
        const address = await axios.get(url);
        return {
            address: address.data.address.road || address.data.address.pedestrian || address.data.address.path,
            city: address.data.address.city || address.data.address.town || address.data.address.village,
            zipCode: parseInt(address.data.address.postcode)
        };
    }
}