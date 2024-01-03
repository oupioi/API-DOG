
import { BelongsToSetAssociationMixin, NonAttribute } from "sequelize";
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    BelongsTo,
    Validate,
    AutoIncrement
} from "sequelize-typescript";
import User from "./User";

class Friends extends Model {
    
    @PrimaryKey
        get relationId(): string {
            return `${this.userId1}-${this.userId2}`;
        }

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
        declare userId2: string;

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
    declare status : string;
    
}
export default Friends;