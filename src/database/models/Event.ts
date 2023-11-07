import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    Default
} from "sequelize-typescript";
import Address from "./Address";
import Sex from "./Sex";
import User from "./User";

@Table({
    timestamps: false,
    tableName: "event",
    modelName: "Event",
    underscored: true
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
        type: DataType.INTEGER,
        allowNull: false
    })
    declare maxPeople: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
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

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idUser: number;

    @BelongsTo(() => User)
    declare user: User;

    @ForeignKey(() => Address)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idAddress: number;

    @BelongsTo(() => Address)
    declare address: Address;
}

export default Event;
