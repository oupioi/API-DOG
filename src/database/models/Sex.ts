import {
    Table,
    Column,
    Model,
    DataType
} from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "Sex",
    modelName: "Sex"
})
class Sex extends Model
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
    declare name: string;
}

export default Sex;
