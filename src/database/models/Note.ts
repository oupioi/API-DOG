import { 
    Table,
    Model,
    Column,
    DataType,
    ForeignKey,
    BelongsTo
} from "sequelize-typescript";
import Park from "./Park";
import { NonAttribute } from "sequelize";

@Table({
    timestamps: false,
    tableName: "note",
    modelName: "Note",
    underscored: true
})
class Note extends Model
{
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 5
        }
    })
    declare note: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare content: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare createdAt: Date;

    @ForeignKey(() => Park)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare idPark: number;

    @BelongsTo(() => Park, {
        onDelete: "CASCADE"
    })
    declare park: NonAttribute<Park>
}

export default Note;