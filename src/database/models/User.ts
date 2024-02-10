import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Validate,
    HasMany
} from "sequelize-typescript";
import Address from "./Address";
import Sex from "./Sex";
import { BelongsToSetAssociationMixin, NonAttribute, Op } from "sequelize";
import Dog from "./Dog";

export enum Roles {
    moderator   = "MODERATOR",
    admin       = "ADMIN",
    viewer      = null
}

@Table({
    timestamps: false,
    tableName: "user",
    modelName: "User",
    underscored: true,
    defaultScope: {
        attributes: {
            exclude: ['idSex', 'idAddress', 'password', "id_sex", "id_address"]
        },
        include: [
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

    @Validate({isEmail: {msg: "Incorrect email address"}, notNull: true})
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare email: string;

    @Validate({
        len: {
            msg: "The pseudo can't have more than 50 characters",
            args: [1, 50]
        },
        is: {
            msg: "Pseudo must begin with '@'",
            args: /^@.*$/
        }
    })
    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare pseudo: string;

    @Validate({
        len: {
            msg: "The password must be of 7 caracters length minimum",
            args: [7, 244]
        }
    })
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

    @Validate({isDate: {args: true, msg: "The birth date is not a date"}})
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

    @Column({
        type: DataType.JSON,
        allowNull: true,
        defaultValue: []
    })
    declare roles: Roles[];

    @ForeignKey(() => Sex)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idSex: number;

    @BelongsTo(() => Sex, 'id_sex')
    declare sex?: NonAttribute<Sex>;


    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idAddress: number;


    @BelongsTo(() => Address, {
        onDelete: "CASCADE",
        foreignKey: "id_address"
    })
    declare address: NonAttribute<Address>;

    @HasMany(() => Dog, {
        onDelete: "CASCADE"
    })
    declare dogs: Dog[];

    declare setSex: BelongsToSetAssociationMixin<Sex, Sex['id']>;
    declare setAddress: BelongsToSetAssociationMixin<Address, Address['id']>;
}

export default User;
