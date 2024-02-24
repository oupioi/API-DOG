import {
    Table,
    Column,
    Model,
    DataType
} from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "alert",
    modelName: "Alert",
    underscored: true
})
class Alert extends Model
{
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.TEXT,
        allowNull: false
    })
    declare title: string;

    @Column({
        type: DataType.STRING,
        allowNull: true
    })
    declare content: string|null;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare zip_code: number|null;

    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: DataType.NOW
    })
    declare createdAt: Date;
}

export default Alert;