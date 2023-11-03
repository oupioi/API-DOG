import {
    Table,
    Column,
    Model,
    DataType
} from "sequelize-typescript";

enum TypeFor {
    event = "event",
    alert = "alert"
}

@Table({
    timestamps: false,
    tableName: "type",
    modelName: "Type"
})
class Type extends Model
{
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.ENUM(...Object.values(TypeFor)),
        allowNull: false,
    })
    declare for: TypeFor;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;
}

export default Type;
