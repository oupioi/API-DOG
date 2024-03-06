import {
    Table,
    Column,
    Model,
    DataType
} from "sequelize-typescript";

@Table({
    timestamps: false,
    tableName: "address",
    modelName: "Address",
    underscored: true
})
class Address extends Model
{
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true
    })
    declare id: number;

    @Column({
        type: DataType.TEXT,
        allowNull: true
    })
    declare address: string|null;

    @Column({
        type: DataType.INTEGER,
        allowNull: true
    })
    declare zipCode: number;

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    declare city: string;

}

export default Address;
