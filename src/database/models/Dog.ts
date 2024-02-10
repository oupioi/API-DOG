import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import User from "./User";
import { BelongsToSetAssociationMixin, NonAttribute } from "sequelize";
import Breed from "./Breed";

export enum DogSex {
    male = 'male',
    female = 'female'
}
@Table({
    timestamps: false,
    tableName: "dog",
    modelName: "Dog",
    underscored: true,
    defaultScope: {
        attributes: {
            exclude: ["id_user", "id_breed", "idUser", "idBreed"]
        }
    }
})
class Dog extends Model
{
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare weight: number;

    @Column({
        type: DataType.ENUM(...Object.values(DogSex)),
        allowNull: false
    })
    declare sex: DogSex;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare birthdate: Date;


    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idUser: number;

    @BelongsTo(() => User, {
        foreignKey: "id_user"
    })
    declare user: NonAttribute<User>;
    

    @ForeignKey(() => Breed)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idBreed: number;

    @BelongsTo(() => Breed, {
        foreignKey: 'id_breed'
    })
    declare breed: NonAttribute<Breed>;

    declare setUser: BelongsToSetAssociationMixin<User, User['id']>;
    declare setBreed: BelongsToSetAssociationMixin<Breed, Breed['id']>;
}

export default Dog;
