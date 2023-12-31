import { SexDTO } from "api/RequestBodies/SexDTO";
import Sex from "database/models/Sex";

export class SexBusiness {
    public async createSex(sexDto: SexDTO)
    {
        try {
            const newSex = await Sex.findOrCreate({
                where: {email: sexDto.name},
                defaults: {
                    name: sexDto.name
                }
            }).then(([sex, created]) => {
                return sex;
            })
            return newSex;
        } catch {
            throw new Error("Couldn't create sex");
        }
    }
}