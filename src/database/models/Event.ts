import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default,
    BelongsToMany
} from "sequelize-typescript";
import Address from "./Address";
import User from "./User";
import EventUser from "./EventUser";
import { BelongsToSetAssociationMixin, NonAttribute } from "sequelize";


@Table({
    timestamps: false,
    tableName: "event",
    modelName: "Event",
    underscored: true, 
    defaultScope: {
        attributes: {
        exclude: ["id_address"]
        }
    }
})
class Event extends Model
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
    declare title: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare description: string;

    @Column({
        type: DataType.INTEGER,
    })
    declare maxPeople: number;

    @Column({
        type: DataType.INTEGER,
    })
    declare followers: number;

    @Default(false)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare closed: boolean;

    @Default(true)
    @Column({
        type: DataType.BOOLEAN,
        allowNull: false,
    })
    declare public: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare date: Date;

    @Column ({
        type: DataType.FLOAT,
    })
    declare allure: number;

    @Column ({
        type: DataType.FLOAT,
    })
    declare temps: number;

    @Column ({
        type: DataType.FLOAT,
    })
    declare distance: number;

    @Column ({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare founder: number;

    @BelongsToMany(() => User, () => EventUser)
    tabUser: User['id'][];

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
    declare setAddress: BelongsToSetAssociationMixin<Address, Address['id']>;

}

export default Event;
