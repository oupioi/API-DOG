import { ParkDTO } from "../../api/RequestBodies/ParkDTO";
import { AddressBusiness } from "./AddressBusiness";
import Address from "../../database/models/Address";
import Park from "../../database/models/Park";
import { CustomError } from "../../api/Tools/ErrorHandler";
import { Op } from "sequelize";

export class ParkBusiness {
    private addressBusiness: AddressBusiness

    public constructor() {
        this.addressBusiness = new AddressBusiness();
    }

    /**
     * Create a new park
     * @param parkDto 
     * @returns Park
     */
    public async createPark(parkDto: ParkDTO): Promise<Park> {
        const address: Address = await this.addressBusiness.createAddress(parkDto.address);
        try {
            const newPark = await Park.create({
                name: parkDto.name,
                topography: parkDto.topography,
                idAddress: address.id
            })
            return newPark;
        } catch {
            throw new CustomError("Couldn't create park");
        }
    }

    /**
     * Get every parks in the database
     * @returns List of parks
     */
    public async getAllParks() {
        const parks: { rows: Park[], count: number } = await Park.findAndCountAll({ include: { all: true } });
        return parks
    }

    /**
     * Return park by its id
     * @param id Park id
     * @returns Promise<Park>
     */
    public async getParkById(id: number) {
        let park: Park | null = await Park.findByPk(id, { include: { all: true } });
        return park;
    }

    /**
     * Get parks by zip_code address
     * @param zip_code 
     * @returns List of parks
     */
    public async getParkByZipCode(zip_code: number) {
        const parks: { rows: Park[], count: number } = await Park.findAndCountAll(
            {
                include: [{
                    model: Address,
                    where: {
                        zip_code: {
                            [Op.startsWith]: `${zip_code}`
                        }
                    },
                    all: true
                }]
            });
        return parks;
    }

    /**
     * Modify a park
     * @param parkDto 
     * @returns Park
     */
    public async modifyPark(parkDto: ParkDTO) {

        let park: Park = await Park.findByPk(parkDto.id,
            {
                include: { model: Address, as: 'address' }
            }
        );

        if (!park) {
            throw new CustomError("Not found", 404);
        }

        park.name = parkDto.name;
        park.topography = parkDto.topography;

        await this.addressBusiness.modifyAddress(park.address.id, parkDto.address);

        await park.save();
        return await Park.findByPk(park.id, { include: { all: true } });
    }

    /**
     * Delete a park by its id
     * @param id Park id
     * @throws CustomError()
     */
    public async deletePark(id: number) {
        const park: Park = await Park.findByPk(id);
        if (park) {
            return park.destroy();
        } else {
            throw new CustomError("Park not found");
        }
    }
}