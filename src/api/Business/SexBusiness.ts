import { SexDTO } from "../../api/RequestBodies/SexDTO";
import Sex from "../../database/models/Sex";

export class SexBusiness {

    /** @todo Seul l'admin peut le faire */
    public async createSex(sexDto: SexDTO)
    {
        const newSex: Sex = await Sex.create({
            name: sexDto.name
        });
        return newSex;
    
    }

    public async getSexes()
    {
        const sexes: Sex[] = await Sex.findAll();
        return sexes;
    }
}