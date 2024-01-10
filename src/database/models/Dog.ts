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

@Table({
    timestamps: false,
    tableName: "dog",
    modelName: "Dog",
    underscored: true,
    defaultScope: {
        attributes: {
            exclude: ["idUser"]
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
    declare breed: string;

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

    declare setUser: BelongsToSetAssociationMixin<User, User['id']>;
}

export default Dog;
