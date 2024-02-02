import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Validate,
    HasMany,
    BelongsToMany
} from "sequelize-typescript";
import Address from "./Address";
import Sex from "./Sex";
import { BelongsToSetAssociationMixin, NonAttribute, Op } from "sequelize";
import Dog from "./Dog";
import Event from "./Event";
import EventUser from "./EventUser";

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


    @BelongsTo(() => Address, {
        onDelete: "CASCADE"
    })
    declare address: NonAttribute<Address>;

    @BelongsToMany(() => Event, () => EventUser)
    events: Event['id'][];

    @HasMany(() => Dog, {
        foreignKey: 'idUser',
        onDelete: "CASCADE"
    })
    declare dogs: Dog[];

    declare setSex: BelongsToSetAssociationMixin<Sex, Sex['id']>;
    declare setAddress: BelongsToSetAssociationMixin<Address, Address['id']>;
}

export default User;
