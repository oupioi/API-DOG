import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    PrimaryKey
} from "sequelize-typescript";
import User from "./User";

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
        allowNull: false
    })
    declare id: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare userId1: number;

    @ForeignKey(() => User)
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
        allowNull: false
    })
    declare date: Date;

    @Column({
        type: DataType.ENUM('pending', 'accepted', 'rejected'),
        allowNull: false,
    })
    declare status: string;
    
}
export default Friend;