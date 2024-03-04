import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey,
    Unique
} from "sequelize-typescript";
import User from "./User";

export enum FriendRequestStatuses {
    accepted    = "accepted",
    pending     = "pending",
    rejected    = "rejected"
}

@Table({
    timestamps: false,
    tableName: "friend",
    modelName: "Friend",
    underscored: true
})
class Friend extends Model {

    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: true
    })
    declare id: number;

    @ForeignKey(() => User)
    @Unique({name: 'userId1-userId2', msg: 'This friendship already exists or is pending'})
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId1: number;

    @ForeignKey(() => User)
    @Unique({name: 'userId1-userId2', msg: 'This friendship already exists or is pending'})
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId2: number;

    @BelongsTo(() => User, "userId1")
    declare user1: User;

    @BelongsTo(() => User, "userId2")
    declare user2: User;

    @Column({
        type: DataType.DATE,
        allowNull: true,
        defaultValue: DataType.NOW
    })
    declare date: Date;

    @Column({
        type: DataType.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
    })
    declare status: FriendRequestStatuses;

}
export default Friend;