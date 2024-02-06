import {
    Table,
    Column,
    Model,
    DataType,
    HasMany
} from "sequelize-typescript";
import Dog from "./Dog";

@Table({
    timestamps: false,
    tableName: "breed",
    modelName: "Breed",
    underscored: true
})
class Breed extends Model
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

    @HasMany(() => Dog, {
        foreignKey: 'idUser',
        onDelete: "CASCADE"
    })
    declare dogs: Dog[];

}

export default Breed;
