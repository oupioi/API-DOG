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

@Table({
    timestamps: false,
    tableName: "dog",
    modelName: "Dog",
    underscored: true,
    defaultScope: {
        attributes: {
            exclude: ["idUser", "idBreed"]
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
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare sex: boolean;

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

    @BelongsTo(() => User)
    declare user: NonAttribute<User>;
    

    @ForeignKey(() => Breed)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idBreed: number;

    @BelongsTo(() => Breed)
    declare breed: NonAttribute<Breed>;

    declare setUser: BelongsToSetAssociationMixin<User, User['id']>;
    declare setBreed: BelongsToSetAssociationMixin<Breed, Breed['id']>;
}

export default Dog;
