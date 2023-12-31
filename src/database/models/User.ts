import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import Address from "./Address";
import Sex from "./Sex";
import { BelongsToSetAssociationMixin, NonAttribute } from "sequelize";

@Table({
    timestamps: false,
    tableName: "user",
    modelName: "User",
    underscored: true,
    defaultScope: {
        attributes: {
            exclude: ['idSex', 'idAddress', 'password']
        },
        include: [
            {model: Address, as: 'address'},
            {model: Sex, as: 'sex'}
        ]
    }
})
class User extends Model
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
    declare email: string;


    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare password: string;


    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare firstName: string;


    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare lastName: string;


    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare birthdate: Date;


    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare notifyFriends: boolean;

    @ForeignKey(() => Sex)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idSex: number;


    @BelongsTo(() => Sex, 'idSex')
    declare sex?: NonAttribute<Sex>;


    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idAddress: number;


    @BelongsTo(() => Address, 'idAddress')
    declare address: NonAttribute<Address>;


    declare setSex: BelongsToSetAssociationMixin<Sex, User['idSex']>;
    declare setAddress: BelongsToSetAssociationMixin<Address, User['idAddress']>;
}

export default User;
