import {
    Table,
    Column,
    Model,
    DataType
} from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "dog",
    modelName: "Dog",
    underscored: true
})
class Dog extends Model
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
    declare breed: string;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare name: string;

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    declare weight: number;

    @Column({
        type: DataType.BOOLEAN,
        allowNull: false
    })
    declare sex: boolean;

    @Column({
        type: DataType.DATE,
        allowNull: false
    })
    declare birthdate: Date;
}

export default Dog;
